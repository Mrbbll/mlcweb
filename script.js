function copyAddress() {
    const address = document.getElementById('server-address').textContent;
    navigator.clipboard.writeText(address).then(() => {
        alert('服务器地址已复制到剪贴板！');
    }).catch((err) => {
        console.error('无法复制地址: ', err);
    });
}