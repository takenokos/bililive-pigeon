import db from '../../db/index'
import { Message } from 'element-ui'
const dbName = 'users'
const userDb = db.get(dbName)
// 读取全部的用户
export function getUsers () {
  return new Promise((resolve) => {
    resolve(userDb.value())
  })
}
// 读取一个用户
export function getUser (uid) {
  return new Promise((resolve) => {
    const val = userDb.find({ uid: uid }).value()
    resolve(val)
  })
}
// 添加用户
export function addUser (cookieObj) {
  const obj = Object.assign({ uid: parseInt(cookieObj.DedeUserID), enable: true }, cookieObj)
  return new Promise((resolve) => {
    const val = userDb.find({ uid: obj.uid }).value()
    if (val) {
      Message({
        message: '用户已存在',
        type: 'error'
      })
      updateUser(obj) // 用户存在的情况下更新数据
      resolve()
    } else {
      userDb.push(obj).write()
      Message({
        message: '用户信息已保存',
        type: 'success'
      })
      resolve()
    }
  })
}
// 更新用户信息
export function updateUser (obj) {
  return new Promise((resolve) => {
    const val = userDb.find({ uid: obj.uid }).value()
    if (!val) {
      Message({
        message: '用户不存在',
        type: 'error'
      })
      resolve()
    } else {
      userDb
        .find({ uid: obj.uid })
        .assign(obj)
      Message({
        message: '用户信息已更新',
        type: 'success'
      })
      resolve()
    }
  })
}
// 删除用户信息 登出
export function deleteUser (uid) {
  return new Promise((resolve) => {
    userDb
      .remove({ uid: uid }).write()
    Message({
      message: '用户已登出',
      type: 'success'
    })
    resolve()
  })
}
