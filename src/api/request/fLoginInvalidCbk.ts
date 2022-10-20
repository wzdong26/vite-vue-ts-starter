

const loginUrlPath = import.meta.env.VITE_BASE_URL_PATH + 'login'

export default function (res: any) {
    alert('用户未登录！');
    location.assign(loginUrlPath);
}
