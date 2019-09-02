import React, { Component } from 'react';
import { Button, Table, Drawer, Form, Col, Row, Input, Select } from 'antd';
import axios from '../utils/axios';
import config from '../utils/config';
const { Option } = Select;
// 将js数据转成表单个数的数据
class ArticleManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],
            currentPage:1,
            pagination:{
                pageSize:config.pageSize,
                total:0
            },
            ids:[],
            visible: false,
            form:{
                title:'',
                parentId:'',
                listStyle:'',
                content:''
            },
            liststyles:[{name:'样式一',value:'styleOne'},{name:'样式二',value:'styleTwo'}]
        };
    }
    componentDidMount() {
        this.findArticleByPage();
    }
    //获取数据
    findArticleByPage = ()=>{
        axios.get('/manager/article/findArticle',{params:{page:this.state.currentPage-1,pageSize:this.state.pagination.pageSize}}).then((res)=>{
            //res是axios封装过后的数据 data属性上才是后台服务器给出的数据
            console.log(res);
            this.setState({
                tableData:res.data.list,
                pagination:{...this.state.pagination,total:res.data.total}
            });
        }).catch((err)=>{
            console.log(err);
        });
    }
    //页面更改后跳转处理程序
    pageChange = (pagination) => {
        //修改数据模型中的数据为当前页面的数据
        this.setState({
            currentPage: pagination.current
        },()=>{
            this.findArticleByPage();
        })
    }

    //新增 模态框显示，如果点了模态框的确定时获取state的数据提交给后台
    toAdd = ()=>{
        let obj = {
            title:'abc',
            liststyle:'111',
            categoryId:7868,
            content:'123123123'
        };
        //保存
        axios.post('/manager/article/saveOrUpdateArticle',obj).then(()=>{
            this.findArticleByPage();
        }).catch((err)=>{
            console.log(err);
        });
    }

    //单项删除
    toDelete = (id)=>{
        //id是要删除的数据
        axios.get('/manager/article/deleteArticleById',{params:{id}}).then(() => {
            this.findArticleByPage();
        }).catch((err)=>{
            console.log(err);
        });
    }

    //批量删除
    toBatchDelete = ()=>{
        //发送ids给后台
        axios.post('/manager/article/batchDeleteArticle',{ids:this.state.ids.toString()}).then((res)=>{
            this.findArticleByPage();
        }).catch((err)=>{
            console.log(err);
        });
    }

    //模态框
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    formChange = ()=>{
        this.setState({
            form:{
                ...this.state.form,
                title: this.props.form.getFieldValue('catename'),
                listStyle: this.props.form.getFieldValue('liststyle'),
                content: this.props.form.getFieldValue('content'),
            }
        });
        console.log(this.state.form);
    }

    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows);
                //selectedRowKeys要进行操作的元素的id组成的数组
                this.setState({
                    ids: selectedRowKeys
                });
            }
        };
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title:'文章标题',
            dataIndex:'title'
        },{
            title:'所属栏目',
            dataIndex:'category.name'
        },{
            title:'排列方式',
            dataIndex:'liststyle'
        },{
            title:'发布时间',
            dataIndex:'publishtime'
        },{
            title:'阅读次数',
            dataIndex:'readtimes'
        },{
            title:'操作',
            dataIndex:'',
            render:(text,record)=>{
                //text属性  record一行记录,对象
                return (
                    <div>
                        <Button type='primary' onClick={this.showDrawer}>编辑</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type='danger' onClick={this.toDelete.bind(this,record.id)}>删除</Button>
                    </div>
                );
            }
        }];
        return (
            <div className="article-manage">
                <div className="btns-div" style={{ marginBottom: 10 }}>
                    <Button type="primary" onClick={this.showDrawer}>新增</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="danger" onClick={this.toBatchDelete}>批量删除</Button>
                    <Drawer title="发布资讯" width={360} onClose={this.onClose} visible={this.state.visible}>
                        <Form layout="vertical" hideRequiredMark onChange={this.formChange}>
                            <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="标题">
                                {getFieldDecorator('catename', {
                                    rules: [{ required: true, message: 'Please enter category name' }],
                                })(<Input placeholder="请输入文章标题" />)}
                                </Form.Item>
                            </Col>
                            </Row>
                            <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="所属栏目">
                                {getFieldDecorator('owner', {
                                    rules: [{ required: true, message: 'Please select an owner' }],
                                })(
                                    <Select placeholder="请选择">
                                        <Option value="xiao">Xiaoxiao Fu</Option>
                                        <Option value="mao">Maomao Zhou</Option>
                                    </Select>,
                                )}
                                </Form.Item>
                            </Col>
                            </Row>
                            <Row gutter={16}>
                           <Col span={24}>
                                <Form.Item label="列表样式">
                                {getFieldDecorator('liststyle', {
                                    rules: [{ required: true, message: 'Please enter category liststylename' }],
                                })(
                                    <div>
                                        <Input id="one" type="radio" name="style" value="styleOne"/>
		                                <label for="one">样式一</label>
                                        <Input id="two" type="radio" name="style" value="styleTwo"/>
		                                <label for="two">样式二</label>
                                    </div>
                                )}
                                </Form.Item>
                            </Col>
                            </Row>
                            <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="正文">
                                {getFieldDecorator('content', {
                                    rules: [
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                    ],
                                })(<Input.TextArea rows={4} placeholder="请输入正文" />)}
                                </Form.Item>
                            </Col>
                            </Row>
                        </Form>
                        <div style={{position: 'absolute',left: 0,bottom: 0,width: '100%',borderTop: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',textAlign: 'right',}}>
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            Cancel
                            </Button>
                            <Button onClick={this.onClose} type="primary">
                            Submit
                            </Button>
                        </div>
                    </Drawer>
                </div>
                <div className="table-div">
                    <Table rowKey="id" rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} pagination={this.state.pagination} onChange={this.pageChange}></Table>
                </div>
            </div>
        );
    }
}
const App = Form.create()(ArticleManage);
export default App;
