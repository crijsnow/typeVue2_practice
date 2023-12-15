<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item,index) in rolelist"
        :key="item.roleId"
        class="role-item"
        :class="{'active':active===index}"
        @click="actived(item.roleId,index)"
      >
        <div class="role-info">
          <svg-icon :icon-class="(active===index)?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="ins(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="del(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/roleadd')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activetitle">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treelist" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                node-key="id"
                :props="{ label: 'title' }"
                show-checkbox
                check-strictly
                :default-expand-all="true"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${personlength})`" name="member">
          <div class="user-wrapper">
            <el-table
              :data="person"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { access_role_list, get_all_tree, get_detail_rolepower, get_person_allordetail, del_role } from '@/apis/roles.js'
export default {
  name: 'Role',
  data() {
    return {
      rolelist: [],
      treelist: [],
      active: 0,
      rolepower: [],
      activetitle: 'tree',
      person: []
    }
  },
  computed: {
    personlength() {
      return this.person ? this.person.length : 0
    }
  },
  async created() {
    await this.getrolelist()
    await this.getree()
    this.actived(2, 0)
  },
  methods: {
    async getrolelist() {
      const res = await access_role_list()
      this.rolelist = res.data
    },
    async getree() {
      const res = await get_all_tree()
      this.treelist = res.data
      this.treedisabled(this.treelist)
    },
    async getperson(id) {
      const res = await get_person_allordetail(id)
      this.person = res.data.rows
      console.log(this.person)
    },
    treedisabled(treelist) {
      treelist.forEach(ele => {
        ele.disabled = true
        if (ele.children) {
          this.treedisabled(ele.children)
        }
      })
    },
    async actived(id, index) {
      this.active = index
      console.log(this.rolelist)
      const res = await get_detail_rolepower(id)
      this.rolepower = res.data.perms
      const treeComponentList = this.$refs.tree
      // 调用setCheckedKeys方法
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(this.rolepower[index])
      })
      this.getperson(id)
    },
    ins(id) {
      this.$router.push(`/roleadd/${id}`)
    },
    del(id) {
      this.$confirm('是否删除当前角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await del_role(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        await this.getrolelist()
        await this.getree()
        this.actived(this.rolelist[0].roleId, 0)
      }).catch(() => {
        this.message({
          type: 'error',
          message: '删除失败'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
