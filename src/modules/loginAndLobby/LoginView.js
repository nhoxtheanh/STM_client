/**
 * Created by GSN on 7/9/2015.
 */

var test_name = "123456";

var LoginView = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        this.render();
        this.stop = true;  
        
    },
    render: function() {

        //var size = cc.director.getVisibleSize();

        var loginView = ccs.load(lobby_scene.login_view);
        this.addChild(loginView.node);

        var button = ccui.helper.seekWidgetByName(loginView.node, "Login_Button");
        button.addClickEventListener(this.onLogIn.bind(this));

        this.textField =  ccui.helper.seekWidgetByName(loginView.node, "ID_TextField");
        //console.log(this.textField.name);

        //this.loginDialog = new DialogLogin(lobby_scene.dialog);
        //this.loginDialog.setVisible(false);
        //this.loginDialog.setEnabled(false);
        //this.loginDialog.setGlobalZOrder(-10);
        //this.addChild(this.loginDialog);
    },
    onEnter:function(){
        this._super();
    },
    onRemoved:function()
    {
  
    },
    updateTest:function(dt)
    {
        
    },
    onSelectBack:function(sender)
    {
        fr.view(ScreenMenu);
    },
    onLogIn: function(sender) {

        //check test login
        var input = this.textField.getString();
        //console.log(input);
        
        if (input == "") {
            
            this.openDialog("Bạn chưa nhập ID");
            return;
        }

        if (input != test_name) {
            
            this.openDialog("Bạn nhập sai ID");
            return;
        }

        gv.gameClient.connect();
        fr.view(Lobby);
    },
    openDialog: function(text) {

        //if (!this.loginDialog) {
        this.loginDialog = new DialogLogin(lobby_scene.dialog);
        this.loginDialog.setText(text);
        //}

        this.stop = true;

        this.addChild(this.loginDialog);
        this.schedule(this.onRemoveDialog.bind(this), 3.0);

        //this.dialog.setVisible(true);
        /*this.loginDialog.setGlobalZOrder(1000);
        this.dialog.setText(text);
        this.schedule(this.onRemoveDialog.bind(this), 3.0);*/
    },
    onRemoveDialog: function() {

        if (this.stop) {
        
        //this.dialog.setVisible(false);
            if (this.loginDialog.getParent()) this.removeChild(this.loginDialog);
            this.unscheduleAllCallbacks();
        }

        this.stop = false;
        //this.unschedule(this.onRemoveDialog.bind(this));
    }
});