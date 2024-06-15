import axios from 'axios'
import Cookies from 'js-cookie';

const csrftoken = Cookies.get('csrftoken');
const Axios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    timeout: 3000,
    withCredentials: true,
    headers: {
        'common': {
            'X-CSRFToken': csrftoken,
        }
    }
})

export default Axios;
