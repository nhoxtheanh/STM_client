/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv||{};
var testnetwork = testnetwork||{};

testnetwork.Connector = cc.Class.extend({
    ctor:function(gameClient)
    {
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userName = "username";
    },
    onReceivedPacket:function(cmd, packet)
    {
        cc.log("onReceivedPacket:", cmd);
        switch (cmd)
        {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest();
                break;
            case gv.CMD.USER_LOGIN:
                cc.log(packet);
                this.sendGetUserInfo();
                fr.view(Lobby);
                break;
            case gv.CMD.USER_INFO:
                //fr.getCurrentScreen().onUserInfo(packet.name, packet.x, packet.y);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
            
            
            //Shop packet
            case gv.CMD.RENEW_SHOPITEMLIST:
                var listid = packet.id;
                var timeStr = packet.timeStr;
                var time = Date.parse(timeStr);
                this.renewTimedShopItemList(listid, time);
                break;

            case gv.CMD.SHOP_BUY:
                var itemId = packet.itemId;
                var itemType = packet.itemType;
                var price = packet.price;
                var currencyType = packet.currencyType;
                switch(itemType){
                    case ShopItemType.Gold:
                        //Increase gold here
                        break;
                    case ShopItemType.Chest:
                        //Increase chest here
                        break;
                    case ShopItemType.Card:
                        //Increase card here
                        break;
                }
                cc.log("receive buy packet");
                break;
            case gv.CMD.UPDATESHOPITEM:
                var item = packet.item;
                this.updateShopItem(item);
            case gv.CMD.UPDATESHOP:
                var shop = new Shop(packet.shopItemArr);
                this.updateShop(shop);
        }
    },
    sendGetUserInfo:function()
    {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendLoginRequest: function () {
        cc.log("sendLoginRequest");
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack(this._userName);
        this.gameClient.sendPacket(pk);
    },
    sendMove:function(direction){
        cc.log("SendMove:" + direction);
        var pk = this.gameClient.getOutPacket(CmdSendMove);
        pk.pack(direction);
        this.gameClient.sendPacket(pk);
    },
    sendShopBuy: function(itemId){
        cc.log("SendShopBuy: " + itemId);
        var pk = this.gameClient.getOutPacket(CmdSendBuy);
        pk.pack(itemId);
        this.gameClient.sendPacket(pk);
    },
    sendrenewTimedShopItemList: function(listId){
        var pk = this.gameClient.getOutPacket(CmdSendRenewShopItemList);
        pk.pack(listId);
        cc.log("listid = " + listId.toString());
        this.gameClient.sendPacket(pk);
    },
    renewTimedShopItemList: function(listid, time){
        var shop = fr.getCurrentScreen().shop;
        var list = shop.getList(listid);
        list.renew(time);
    },
    updateShopItem: function(item){
        var shop = fr.getCurrentScreen().shop;
        var _item = shop.getItem(item.id);
        _item = item;
    },
    updateShop: function(shop){
        fr.getCurrentScreen().shop = shop;

    }

});



