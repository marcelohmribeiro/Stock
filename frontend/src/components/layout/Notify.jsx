import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notify() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
            theme="dark"
        />
    )
}

export default Notify