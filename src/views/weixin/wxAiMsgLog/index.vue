<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收方" prop="tojid">
        <el-input
          v-model="queryParams.tojid"
          placeholder="请输入接收方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送方" prop="jid">
        <el-input
          v-model="queryParams.jid"
          placeholder="请输入发送方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息来源" prop="msgOrign">
        <el-input
          v-model="queryParams.msgOrign"
          placeholder="请输入消息来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.chat_msg_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否已读" prop="isread">
        <el-input
          v-model="queryParams.isread"
          placeholder="请输入是否已读"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间戳" prop="timestampValue">
        <el-date-picker clearable
          v-model="queryParams.timestampValue"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择时间戳">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['weixin:wxAiMsgLog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['weixin:wxAiMsgLog:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['weixin:wxAiMsgLog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['weixin:wxAiMsgLog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wxAiMsgLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息id" align="center" prop="msgId" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="接收方" align="center" prop="tojid" />
      <el-table-column label="发送方" align="center" prop="jid" />
      <el-table-column label="聊天消息" align="center" prop="msg" />
      <el-table-column label="消息来源" align="center" prop="msgOrign">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chat_origin" :value="scope.row.msgOrign"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.chat_msg_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="是否已读" align="center" prop="isread">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isread"/>
        </template>
      </el-table-column>
      <el-table-column label="时间戳" align="center" prop="timestampValue" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.timestampValue, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['weixin:wxAiMsgLog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['weixin:wxAiMsgLog:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改ai对话记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="接收方" prop="tojid">
          <el-input v-model="form.tojid" placeholder="请输入接收方" />
        </el-form-item>
        <el-form-item label="发送方" prop="jid">
          <el-input v-model="form.jid" placeholder="请输入发送方" />
        </el-form-item>
        <el-form-item label="聊天消息" prop="msg">
          <el-input v-model="form.msg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="消息来源" prop="msgOrign">
          <el-input v-model="form.msgOrign" placeholder="请输入消息来源" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in dict.type.chat_msg_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否已读" prop="isread">
          <el-input v-model="form.isread" placeholder="请输入是否已读" />
        </el-form-item>
        <el-form-item label="时间戳" prop="timestampValue">
          <el-date-picker clearable
            v-model="form.timestampValue"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择时间戳">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWxAiMsgLog, getWxAiMsgLog, delWxAiMsgLog, addWxAiMsgLog, updateWxAiMsgLog } from "@/api/weixin/wxAiMsgLog";

export default {
  name: "WxAiMsgLog",
  dicts: ['chat_msg_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // ai对话记录表格数据
      wxAiMsgLogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        tojid: null,
        jid: null,
        msg: null,
        msgOrign: null,
        type: null,
        isread: null,
        timestampValue: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询ai对话记录列表 */
    getList() {
      this.loading = true;
      listWxAiMsgLog(this.queryParams).then(response => {
        this.wxAiMsgLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        msgId: null,
        userId: null,
        tojid: null,
        jid: null,
        msg: null,
        msgOrign: null,
        type: null,
        isread: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        timestampValue: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.msgId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加ai对话记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const msgId = row.msgId || this.ids
      getWxAiMsgLog(msgId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改ai对话记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.msgId != null) {
            updateWxAiMsgLog(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWxAiMsgLog(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const msgIds = row.msgId || this.ids;
      this.$modal.confirm('是否确认删除ai对话记录编号为"' + msgIds + '"的数据项？').then(function() {
        return delWxAiMsgLog(msgIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('weixin/wxAiMsgLog/export', {
        ...this.queryParams
      }, `wxAiMsgLog_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
