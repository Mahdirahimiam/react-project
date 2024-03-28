const FetchApi = async(url, option = {}) => {
    try {
        const res = await fetch(url, option);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export default FetchApi