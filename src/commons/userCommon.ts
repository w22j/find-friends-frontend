export const defaultPicture = "https://hb-project-1323562344.cos.ap-guangzhou.myqcloud.com/index%2Fcommon.jpeg"

export const jsonParseTag = (usersList) => {
    usersList.forEach(user => {
        if (user.tags) {
            user.tags = user.tags ? JSON.parse(user.tags) : '该用户暂未设置';
        }
    })
}