const axios = require('axios')
const findNeedItem = require('./untils/findNeedItem')
const model_buff = require('./models/buff_model')

setInterval(() => {
    model_buff.fetchPercent2().then(percent_2 => {
        axios({
            url: "https://buff.163.com/api/market/goods?game=csgo&page_num=1&use_suggestion=0",
            method: 'GET'
        }).then(response_goods => {
            model_buff.fetch_error_goods().then(error_goods => {
                const goods_list_id = response_goods.data.data.items.map(item => item.id).slice(0, 5)

                for (const good_id of [...goods_list_id, ...error_goods]) {
                    axios({
                        url: `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${good_id}&page_num=1&sort_by=default&mode=&allow_tradable_cooldown=1&_=1683595858989`,
                        method: 'GET'
                    }).then(response_good_item_detail => {
                        model_buff.fetchPercentMain().then(percent_1 => {

                            const info_good = findNeedItem(response_good_item_detail.data.data.items.slice(0, 3), percent_1)

                            if (info_good) {
                                model_buff.fetchActiveGood(info_good.id).then(res => {

                                    if (!res) {

                                        axios({
                                            url: `http://176.212.124.205:8080/buf163/get_stat?goods_id=${good_id}`,
                                            method: "GET"
                                        }).then(trend => {
                                            const trend_value = trend.data.response

                                            if ((parseFloat(info_good.max) - parseFloat(trend_value)) < 0) {
                                                const percent = (parseFloat(trend_value) - parseFloat(info_good.max)) / info_good.max * 100

                                                if (percent > percent_2) {
                                                    const max = parseFloat(info_good.max) * 0.975

                                                    if (info_good.min - max < 0) {
                                                        const percent_result = (max - parseFloat(info_good.min)) / info_good.min * 100

                                                        if (percent_result >= percent_1) {
                                                            const message_info = `
                                ${info_good.info.icon_url}\n\nПредмет: <a href="https://buff.163.com/goods/${good_id}">${response_good_item_detail.data.data.goods_infos[good_id]['market_hash_name']}</a>\nЦена покупки: ${info_good.min}Y\nПрофит: ${info_good.percent}%\nТенденция: ${trend_value}
                            `
                                                            axios({
                                                                url: 'http://45.9.43.229:8888',
                                                                method: 'post',
                                                                data: {
                                                                    message: message_info
                                                                }
                                                            })
                                                            model_buff.AddActiveGood(info_good.id)
                                                        }
                                                    }
                                                }
                                            }
                                        }).catch(e => {
                                            console.log(e.message)
                                            model_buff.add_good_item(good_id)
                                        })
                                    }
                                })
                            }
                        })

                    }).catch((error) => {
                        model_buff.add_good_item(good_id)
                    })
                }
            })
        })
    })
}, 4000)