
var gv = gv || {};

// globals
var DIRECTOR = null;
var WIN_SIZE = null;
var DESIGN_RESOLUTION_WIDTH = 1080;
var DESIGN_RESOLUTION_HEIGHT = 1920;
cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(true);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    cc.view.setFrameSize(540,960);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets(), true);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets() + "/res", true);
    cc.loader.resPath = "res";
    cc.LoaderScene.preload(g_resources, function () {
        //hide fps
        cc.director.setDisplayStats(false);
        DIRECTOR = cc.director;
        WIN_SIZE = DIRECTOR.getWinSize();
        // Setup the resolution policy and design resolution size
        var frameSize = cc.view.getFrameSize();
        cc.view.setFrameSize(DESIGN_RESOLUTION_WIDTH*1.5, DESIGN_RESOLUTION_HEIGHT*1.5);

        var ratio = frameSize.width/frameSize.height;
        if(ratio < 2){
            cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH,DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
        }else{
            cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH,DESIGN_RESOLUTION_WIDTH/2, cc.ResolutionPolicy.SHOW_ALL);
        }

        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize(true);
        //socket
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();
        //modules
        testnetwork.connector = new testnetwork.Connector(gv.gameClient);

        fr.view(LoginView);
    }, this);
};
cc.game.run();