
import { getUsers, addUser, deleteUser } from '@/utils/users-db.js'
import { getUserInfo } from '@/api/user'
const state = {
  users: []
}

const mutations = {
  // 清空用户
  CLEAR_USERS (state) {
    state.users = []
  },
  // 添加用户
  ADD_USER (state, user) {
    const bol = state.users.some(obj => obj.uid === user.uid)
    !bol && state.users.push(user)
  },
  // 删除用户
  DELETE_USER (state, uid) {
    const index = state.users.findIndex(obj => obj.uid === uid)
    index > -1 && state.users.splice(index, 1)
  }
}

const actions = {
  async getUsers ({ dispatch, commit }) {
    commit('CLEAR_USERS')
    getUsers().then(data => {
      dispatch('getUserInfo', data)
    })
  },
  // 用户信息 递归
  getUserInfo ({ dispatch, commit }, data) {
    if (data.length <= 0) {
      return
    }
    const item = data[0]
    const cookie = item.cookie
    getUserInfo(cookie).then(res => {
      const user = Object.assign({}, item, { info: res.data })
      commit('ADD_USER', user)
      data.shift() // 删除第一个
      setTimeout(() => { // 1s延迟加载，保证cookie的正常
        dispatch('getUserInfo', data)
      }, 1000)
    })
  },
  // 添加用户 登陆
  addUser ({ commit }, cookie) {
    const obj = {
      uid: parseInt(cookie.DedeUserID),
      enable: true,
      cookie
    }
    addUser(obj).then(() => {
      getUserInfo(cookie).then(res => {
        const user = Object.assign({}, obj, { info: res.data })
        commit('ADD_USER', user)
      })
    })
  },
  // 删除用户 登出
  deleteUser ({ commit }, uid) {
    deleteUser(uid).then(() => {
      commit('DELETE_USER', uid)
    })
  }
}
const getters = {
  users: state => state.users
}

export default {
  state,
  mutations,
  actions,
  getters
}