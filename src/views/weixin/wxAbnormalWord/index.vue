<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主语" prop="subject">
        <el-input
          v-model="queryParams.subject"
          placeholder="请输入主语"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="谓语" prop="predicate">
        <el-input
          v-model="queryParams.predicate"
          placeholder="请输入谓语"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="宾语" prop="object">
        <el-input
          v-model="queryParams.object"
          placeholder="请输入宾语"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定语" prop="attribute">
        <el-input
          v-model="queryParams.attribute"
          placeholder="请输入定语"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状语" prop="adverbial">
        <el-input
          v-model="queryParams.adverbial"
          placeholder="请输入状语"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="补语" prop="complement">
        <el-input
          v-model="queryParams.complement"
          placeholder="请输入补语"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['weixin:wxAbnormalWord:add']"
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
          v-hasPermi="['weixin:wxAbnormalWord:edit']"
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
          v-hasPermi="['weixin:wxAbnormalWord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['weixin:wxAbnormalWord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wxAbnormalWordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="主语" align="center" prop="subject" />
      <el-table-column label="谓语" align="center" prop="predicate" />
      <el-table-column label="宾语" align="center" prop="object" />
      <el-table-column label="定语" align="center" prop="attribute" />
      <el-table-column label="状语" align="center" prop="adverbial" />
      <el-table-column label="补语" align="center" prop="complement" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['weixin:wxAbnormalWord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['weixin:wxAbnormalWord:remove']"
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

    <!-- 添加或修改答非所问单词对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主语" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入主语" />
        </el-form-item>
        <el-form-item label="谓语" prop="predicate">
          <el-input v-model="form.predicate" placeholder="请输入谓语" />
        </el-form-item>
        <el-form-item label="宾语" prop="object">
          <el-input v-model="form.object" placeholder="请输入宾语" />
        </el-form-item>
        <el-form-item label="定语" prop="attribute">
          <el-input v-model="form.attribute" placeholder="请输入定语" />
        </el-form-item>
        <el-form-item label="状语" prop="adverbial">
          <el-input v-model="form.adverbial" placeholder="请输入状语" />
        </el-form-item>
        <el-form-item label="补语" prop="complement">
          <el-input v-model="form.complement" placeholder="请输入补语" />
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
import { listWxAbnormalWord, getWxAbnormalWord, delWxAbnormalWord, addWxAbnormalWord, updateWxAbnormalWord } from "@/api/weixin/wxAbnormalWord";

export default {
  name: "WxAbnormalWord",
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
      // 答非所问单词表格数据
      wxAbnormalWordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        subject: null,
        predicate: null,
        object: null,
        attribute: null,
        adverbial: null,
        complement: null
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
    /** 查询答非所问单词列表 */
    getList() {
      this.loading = true;
      listWxAbnormalWord(this.queryParams).then(response => {
        this.wxAbnormalWordList = response.rows;
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
        id: null,
        subject: null,
        predicate: null,
        object: null,
        attribute: null,
        adverbial: null,
        complement: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加答非所问单词";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWxAbnormalWord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改答非所问单词";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWxAbnormalWord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWxAbnormalWord(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除答非所问单词编号为"' + ids + '"的数据项？').then(function() {
        return delWxAbnormalWord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('weixin/wxAbnormalWord/export', {
        ...this.queryParams
      }, `wxAbnormalWord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
