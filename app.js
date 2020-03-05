const superagent = require('superagent');
const http=require('http');
const url=require('url');
const fs=require('fs');

http.createServer(function(req,res){
    var urlObj=url.parse(req.url);
    if(urlObj.path=='/'){
        superagent.get('https://blz.bicoin.com.cn/settingFirmOffer/showAllLeaderList?pageSize=200&pageNum=1&sortType=8&sort=&type=future&searchName=')
            .set({'Accept':'application/json,application/xml,application/xhtml+xml,text/html;q=0.9,image/webp,*/*;q=0.8'})
            .set({'Accept-Encoding':'gzip, deflate'})
            .set({'Accept-Language':'zh-CN,zh'})
            .set({'Appversion':'2.4.0'})
            .set({'Auth':'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNDc2NTk1NTEwNTcwNjQ3NTUyIiwiZXhwIjoxNTg1Mjg4MDY1fQ.MQoVayMwaxjVV7vAnkicsmQPl-HwMuHsLTJIy9kbVpw'})
            .set({'Connection':'keep-alive'})
            .set({'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})
            .set({'From':'Android'})
            .set({'Logintime':'1583204331367'})
            .set({'Mobilid':'AuKS2zOcXW1O0dFBl0z8-xVTqeNHqDpqFlhtSA8fDVXg'})
            .set({'Mobilkey':'44109B0C5E4B3C5472CFA49242E8F95A'})
            .set({'Redrisegreendown':'2'})
            .set({'Token':'610435ff9510fb5b80bf703a1095d6e3'})
            .set({'User-Agent':'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-cn; MuMu Build/V417IR) AppleWebKit/533.1 (KHTML, like Gecko) Version/5.0 Mobile Safari/533.1'})
            .set({'Usertempid':''})
            .set({'Host':'blz.bicoin.com.cn'})
            .end((err,response)=>{
                let content = ''
                let info = response.body.data;
                superagent.get('http://112.124.201.164:9000/circle/getCircleContent?createUserId=5333')
                .end((err,response2)=>{
                    let info2 = response2.body.data.threadList.filter((item,index,arr)=>item.dateline*1>(arr[index+1]||{dateline:0}).dateline*1)
                    content += `<section class="item">
                    <div class="header">
                        <img src="http://topcoin.oss-cn-hangzhou.aliyuncs.com/lr_headimg/75fac2373382ab813b397915e1ff1b29.JPEG">
                        <div>
                            <div>南砚</div>
                            <span class="time">vx:jump_with_joy</span>
                        </div>
                    </div>
                    ${info2.map((item,index)=>{
                        let date = getTimeDiff(new Date(item.dateline*1000));
                        return `
                            <div class="contain ${index==0?'':'border_top'}">
                                ${item.content.replace(/\n/g,'</br>').replace(/^<\/br>/,'')}
                                <div style="text-align:right;color: #3064d8;" class="time">${date}</div>
                            </div>`
                        }).join('\n')
                    }
                    </section>`
                    content += `${
                        info.filter(item=>!/半木夏/.test(item.leaderName)&&item.pointContent).map(item=>{
                            return `<section class="item ${/免费/.test(item.statusStr)?'freeX':''}">
                                <div class="header">
                                    <img src="${item.img}">
                                    <div>
                                        <div>${item.leaderName}</div>
                                        <a class="time" href="${item.pointUrl}">${item.pointTimeStr.split(' ')[0]}</a>
                                    </div>
                                </div>
                                <div class="contain">
                                    ${item.pointContent.replace(/\n/g,'</br>')}
                                </div>
                                <ul class="info">
                                    <li class="${item.balance<0?'red':''}">${item.balance}$<span>资金</span></li>
                                    <li class="${item.earnAll<0?'red':''}">${item.earnAll}%<span>共盈利</span></li>
                                    <li class="${item.monthIncome<0?'red':''}">${item.monthIncome}%<span>月盈利</span></li>
                                    <li class="${item.earnWeek<0?'red':''}">${item.earnWeek}%<span>周盈利</span></li>
                                </ul>
                            </section>`
                        }).join('\n')
                    }`
                    res.setHeader('Content-Type','text/html;charset=utf-8');
                    fs.readFile('./index.html','utf8',function(err,data){
                        let html = data.toString().replace('<!-- content -->',content)
                        res.write(html)
                        res.end();
                    })
                })
                
            })
        
    }else{
        res.setHeader('Content-Type','text/html;charset=utf-8');
        res.write("<h1>您要请求的页面被恐龙吃了!<h1>");
        res.end();
    }
}).listen(8090);

function getTimeDiff(date){
    timeold = (Date.now() - date.getTime()); //总豪秒数
    secondsold = Math.floor(timeold / 1000);          //总秒数
    e_daysold = timeold / (24 * 60 * 60 * 1000);
    daysold = Math.floor(e_daysold);                 //相差天数
    e_hrsold = (e_daysold - daysold) * 24;
    hrsold = Math.floor(e_hrsold);                   //相差小时数
    e_minsold = (e_hrsold - hrsold) * 60;
    minsold= Math.floor(e_minsold)                   //相差分钟数
    seconds = Math.floor((e_minsold - minsold) * 60);  //相差秒数
    return (daysold!=0?(daysold + "天"):'') + (hrsold!=0?(hrsold + "小时"):'') + (minsold!=0?(minsold + "分"):'') + seconds + "秒前"
}

