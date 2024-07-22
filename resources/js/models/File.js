import axios from 'axios';
export default class File {
    static async all() {
        const response = await axios.get('/api');
        const data = response.data;
        console.log(data);
        if (data.status === 'success') {
            return data.files;
        }
        throw new Error('Unable to fetch files.');
    }
}
