// import express from 'express'
const express = require('express')
const app = express()

app.get('/api/jsonp',(req,res)=>{
    const {callback} = req.query;
    // 返回一段js代码，代码的内容是一个函数的调用，函数的名字是前端的get请求的参数。
    res.send(`${callback}("hello jsonp")`)
})

app.listen(3001,()=>{
    console.log(`server is running at 3001`);
})

