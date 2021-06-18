/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD ||{};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MOVE = 2001;


gv.CMD.SHOP_BUY = 4001;
gv.CMD.RENEW_SHOPITEMLIST = 4002;
gv.CMD.UPDATESHOP = 4003;
gv.CMD.UPDATESHOPITEMLIST = 4004;
gv.CMD.UPDATESHOPITEM = 4005;


testnetwork = testnetwork||{};
testnetwork.packetMap = {};

/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HAND_SHAKE);
        },
        putData:function(){
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)
CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack:function(){
            this.packHeader();
            this.updateSize();
        }
    }
)

CmdSendLogin = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_LOGIN);
        },
        pack:function(user){
            this.packHeader();
            this.putString(user);
            this.updateSize();
        }
    }
)

CmdSendMove = fr.OutPacket.extend(
    {
        ctor:function()
        {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MOVE);
        },
        pack:function(direction){
            this.packHeader();
            this.putShort(direction);
            this.updateSize();
        }
    }
)


CmdSendBuy = fr.OutPacket.extend(
    {
        ctor: function(){
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.SHOP_BUY);
        },
        pack: function(itemId){
            this.packHeader();
            this.putInt(itemId);
            this.updateSize();
        }
    }
)

CmdSendRenewShopItemList = fr.OutPacket.extend(
    {
        ctor: function(){
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.RENEW_SHOPITEMLIST);
        },
        pack: function(listId){
            this.packHeader();
            this.putInt(listId);
            this.updateSize();
        }
    }
)

/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
        }
    }
);


testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);

testnetwork.packetMap[gv.CMD.SHOP_BUY] = fr.InPacket.extend(
    {
        ctor:function()
        {
            this._super();
        },
        readData:function(){
            this.itemId = this.getInt();
            this.itemType = this.getShort();
            this.price = this.getInt();
            this.currencyType = this.getShort();
            switch(this.itemType){
                case ShopItemType.Card:
                    this.cardId = this.getInt();
                    this.amount = this.getInt();
                    break;
                case ShopItemType.Chest:
                    this.cardIdArr = [];
                    this.cardAmountArr = [];
                    this.gold = this.getInt();
                    var cardLength = this.getShort();
                    for(var i = 0; i < cardLength; i++){
                        this.cardIdArr.push(this.getInt());
                    }

                    var amountLength = this.getShort();
                    for(var i = 0; i < amountLength; i++){
                        this.cardAmountArr.push(this.getInt());
                    }
                    break;
                case ShopItemType.Gold:
                    this.amount = this.getInt();
                    break;
            }
        }
    }
);

testnetwork.packetMap[gv.CMD.RENEW_SHOPITEMLIST] = fr.InPacket.extend(
    {
        ctor: function()
        {
            this._super();
        },
        readData: function(){
            this.id = this.getInt();
            cc.log("renew id = " + this.id);
            this.timeStr = this.getString();
        }
    }
)

testnetwork.packetMap[gv.CMD.UPDATESHOP] = fr.InPacket.extend(
    {
        ctor: function(){
            this._super();
        },
        readData: function(){
            var listLength = this.getShort();

            this.shopItemArr = [];
            for(var i = 0; i < listLength; i++){
                var list;
                var items = [];
                var id = this.getInt();
                var listType = this.getShort();
                var length = this.getShort();
                for(var j = 0; j < length; j++) {                    
                    var item;
                    var itemId = this.getInt();
                    var itemType = this.getShort();
                    var price = this.getInt();
                    var currencyType = this.getShort();
                    var maxBuy = this.getInt();

                    switch(itemType){
                        case ShopItemType.Card:
                            var cardId = this.getInt();
                            var amount = this.getInt();
                            item = new ShopItemCard(itemId, itemType, price, currencyType, maxBuy, cardId, amount);
                            break;
                        case ShopItemType.Chest:
                            var minGold = this.getInt();
                            var maxGold = this.getInt();
                            var minCard = this.getInt();
                            var maxCard = this.getInt();

                            var cardTypelength = this.getShort();
                            var cardType = [];
                            for(var l = 0; l < cardTypelength; l++){
                                cardType.push(this.getInt());
                            }
                            item = new ShopItemChest(itemId, itemType, price, currencyType, maxBuy, minGold, maxGold, minCard, maxCard, cardType);
                            break;
                        case ShopItemType.Gold:
                            var amount = this.getInt();
                            item = new ShopItemGold(itemId, itemType, price, currencyType, maxBuy, amount);
                            break;
                    }
                    items.push(item);
                }
                if(listType == ShopItemListType.ShopItemList)
                    list = new ShopItemList(id, items, res.SHOP_CATEGORY_GOLD);
                else{
                    var renewTime = Date.parse(this.getString());
                    list = new TimedShopItemList(id, items, res.SHOP_CATEGORY_DAILY, renewTime);
                }
                this.shopItemArr.push(list);
            }
        }
    }
)

testnetwork.packetMap[gv.CMD.UPDATESHOPITEM] = fr.InPacket.extend(
    {
        ctor: function(){
            this._super();
        },
        readData: function(){
            this.item = null;
            var id = this.getInt();
            var itemType = this.getShort();
            var price = this.getInt();
            var currencyType = this.getShort();
            var maxBuy = this.getInt();

            switch(itemType){
                case ShopItemType.Card:
                    var cardId = this.getInt();
                    var amount = this.getInt();
                    this.item = new ShopitemCard(id, price, currencyType, maxBuy, cardId, amount);
                    break;
                case ShopItemType.Chest:
                    var minGold = this.getInt();
                    var maxGold = this.getInt();
                    var minCard = this.getInt();
                    var maxCard = this.getInt();

                    var cardTypelength = this.getShort();
                    var cardType = [];
                    for(var l = 0; l < cardTypelength; l++){
                        cardType.push(this.getInt());
                    }
                    this.item = new ShopitemCard(id, price, currencyType, maxBuy, minGold, maxGold, minCard, maxCard, cardType);
                    break;
                case ShopItemType.Gold:
                    var amount = this.getInt();
                    this.item = new ShopitemCard(id, price, currencyType, maxBuy, amount);
                    break;
            }
        }
    }
)
