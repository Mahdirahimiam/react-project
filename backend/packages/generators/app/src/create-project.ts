/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path';
import fse from 'fs-extra';
import chalk from 'chalk';
import execa from 'execa';
import ora from 'ora';
import _ from 'lodash';

import stopProcess from './utils/stop-process';
import { trackUsage, captureStderr } from './utils/usage';
import mergeTemplate from './utils/merge-template.js';
import tryGitInit from './utils/git';

import packageJSON from './resources/json/common/package.json';
import jsconfig from './resources/json/js/jsconfig.json';
import adminTsconfig from './resources/json/ts/tsconfig-admin.json';
import serverTsconfig from './resources/json/ts/tsconfig-server.json';
import { createDatabaseConfig, generateDbEnvariables } from './resources/templates/database';
import createEnvFile from './resources/templates/env';
import { Configuration, Scope, isStderrError } from './types';

export default async function createProject(
  scope: Scope,
  { client, connection, dependencies }: Configuration
) {
  console.log(`Creating a new Strapi application at ${chalk.green(scope.rootPath)}.`);
  console.log('Creating files.');

  const { rootPath, useTypescript } = scope;
  const resources = join(__dirname, 'resources');

  const language = useTypescript ? 'ts' : 'js';

  try {
    // copy files
    await fse.copy(join(resources, 'files', language), rootPath);

    // copy dot files
    await fse.writeFile(join(rootPath, '.env'), createEnvFile());

    const copyDotFilesFromSubDirectory = (subDirectory: string) => {
      const files = fse.readdirSync(join(resources, 'dot-files', subDirectory));

      return Promise.all(
        files.map((file) => {
          const src = join(resources, 'dot-files', subDirectory, file);
          const dest = join(rootPath, `.${file}`);
          return fse.copy(src, dest);
        })
      );
    };

    // Copy common dot files
    copyDotFilesFromSubDirectory('common');

    // Copy JS dot files
    // For now we only support javascript and typescript, so if we're not using
    // typescript, then we can assume we're using javascript. We'll need to change
    // this behavior when we'll abstract the supported languages even more.
    if (!useTypescript) {
      copyDotFilesFromSubDirectory('js');
    }

    await trackUsage({ event: 'didCopyProjectFiles', scope });

    // copy templates
    await fse.writeJSON(
      join(rootPath, 'package.json'),
      packageJSON({
        strapiDependencies: scope.strapiDependencies,
        additionalsDependencies: dependencies,
        strapiVersion: scope.strapiVersion,
        projectName: _.kebabCase(scope.name),
        uuid: scope.uuid,
        packageJsonStrapi: scope.packageJsonStrapi,
      }),
      {
        spaces: 2,
      }
    );

    await trackUsage({ event: 'didWritePackageJSON', scope });

    if (useTypescript) {
      const filesMap = {
        'tsconfig-admin.json.js': 'src/admin',
        'tsconfig-server.json.js': '.',
      };

      for (const [fileName, path] of Object.entries(filesMap)) {
        const destPath = join(rootPath, path, 'tsconfig.json');

        if (fileName === 'tsconfig-admin.json.js') {
          await fse.writeJSON(destPath, adminTsconfig(), { spaces: 2 });
        }
        if (fileName === 'tsconfig-server.json.js') {
          await fse.writeJSON(destPath, serverTsconfig(), { spaces: 2 });
        }
      }
    } else {
      const filesMap = { 'jsconfig.json.js': '.' };

      for (const [, path] of Object.entries(filesMap)) {
        const destPath = join(rootPath, path, 'jsconfig.json');
        await fse.writeJSON(destPath, jsconfig(), { spaces: 2 });
      }
    }

    // ensure node_modules is created
    await fse.ensureDir(join(rootPath, 'node_modules'));

    // create config/database
    await fse.appendFile(join(rootPath, '.env'), generateDbEnvariables({ client, connection }));
    await fse.writeFile(
      join(rootPath, `config/database.${language}`),
      createDatabaseConfig({ useTypescript })
    );

    await trackUsage({ event: 'didCopyConfigurationFiles', scope });

    // merge template files if a template is specified
    const hasTemplate = Boolean(scope.template);
    if (hasTemplate) {
      try {
        await mergeTemplate(scope, rootPath);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`⛔️ Template installation failed: ${error.message}`);
        }

        throw error;
      }
    }
  } catch (err) {
    await fse.remove(scope.rootPath);
    throw err;
  }

  await trackUsage({ event: 'willInstallProjectDependencies', scope });

  const installPrefix = chalk.yellow('Installing dependencies:');
  const loader = ora(installPrefix).start();

  const logInstall = (chunk = '') => {
    loader.text = `${installPrefix} ${chunk.toString().split('\n').join(' ')}`;
  };

  try {
    if (scope.installDependencies !== false) {
      const runner = runInstall(scope);

      runner.stdout?.on('data', logInstall);
      runner.stderr?.on('data', logInstall);

      await runner;
    }

    loader.stop();
    console.log(`Dependencies installed ${chalk.green('successfully')}.`);

    await trackUsage({ event: 'didInstallProjectDependencies', scope });
  } catch (error) {
    const stderr = isStderrError(error) ? error.stderr : '';

    loader.stop();
    await trackUsage({
      event: 'didNotInstallProjectDependencies',
      scope,
      error: stderr.slice(-1024),
    });

    console.error(`${chalk.red('Error')} while installing dependencies:`);
    console.error(stderr);

    await captureStderr('didNotInstallProjectDependencies', error);

    console.log(chalk.black.bgWhite(' Keep trying!'));
    console.log();
    console.log(
      chalk.bold(
        'Oh, it seems that you encountered errors while installing dependencies in your project.'
      )
    );
    console.log(`Don't give up, your project was created correctly.`);
    console.log(
      `Fix the issues mentioned in the installation errors and try to run the following command:`
    );
    console.log();
    console.log(
      `cd ${chalk.green(rootPath)} && ${chalk.cyan(scope.useYarn ? 'yarn' : 'npm')} install`
    );
    console.log();

    stopProcess();
  }

  await trackUsage({ event: 'didCreateProject', scope });

  // Init git
  if (await tryGitInit(rootPath)) {
    console.log('Initialized a git repository.');
    console.log();
  }

  console.log();
  console.log(`Your application was created at ${chalk.green(rootPath)}.\n`);

  const cmd = chalk.cyan(scope.useYarn ? 'yarn' : 'npm run');

  console.log('Available commands in your project:');
  console.log();
  console.log(`  ${cmd} develop`);
  console.log(
    '  Start Strapi in watch mode. (Changes in Strapi project files will trigger a server restart)'
  );
  console.log();
  console.log(`  ${cmd} start`);
  console.log('  Start Strapi without watch mode.');
  console.log();
  console.log(`  ${cmd} build`);
  console.log('  Build Strapi admin panel.');
  console.log();
  console.log(`  ${cmd} strapi`);
  console.log(`  Display all available commands.`);
  console.log();
  console.log('You can start by doing:');
  console.log();
  console.log(`  ${chalk.cyan('cd')} ${rootPath}`);
  console.log(`  ${cmd} develop`);
  console.log();
}

const installArguments = ['install', '--production', '--no-optional'];
function runInstall({ rootPath, useYarn }: Scope) {
  if (useYarn) {
    // Increase timeout for slow internet connections.
    installArguments.push('--network-timeout 1000000');

    return execa('yarnpkg', installArguments, {
      cwd: rootPath,
      stdin: 'ignore',
    });
  }

  return execa('npm', installArguments, { cwd: rootPath, stdin: 'ignore' });
}
