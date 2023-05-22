const findNeedItem = (items = [], difference = 1) => {
    if(items.length === 0)
        return false
    const min = items.reduce((acc, now) => parseFloat(now.price) < parseFloat(acc.price) ? now : acc, items[0])
    const max = items.reduce((acc, now) => parseFloat(now.price) > parseFloat(acc.price) ? now : acc, items[0])

    const percent = ((parseFloat(max.price) - parseFloat(min.price)) / parseFloat(min.price)) * 100

    if(percent >= difference)
        return {
            id: min.id,
            id_good: min.goods_id,
            paintwear: min.asset_info.paintwear,
            info: {...min.asset_info.info},
            percent: percent.toFixed(2),
            max: max.price,
            min: min.price
        }
    else return false
}

module.exports = findNeedItem