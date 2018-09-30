mainModule.controller('juheCtrl', ['$scope', function($scope) {
    document.getElementsByTagName('html')[0].scrollTop = 0;
    document.getElementsByTagName('body')[0].scrollTop = 0;
    $scope.config = {
        cloumns: 3,
        item: ".itembox",
        marginTop: 0,
        readyloading: false
    }
    $scope.$on('ngRepeatFinished', function (event) {    
    	$scope.config.initWater();
    });  
    $scope.data = [{
        title: "中型包装印刷企业",
        url: "main/juheDetail/6",
        id: "6",
        imgsrc: "images/business/list6.png",
        content: "艺术与技术兼备，才成就了生活中的形形色色。企业以专业的设计、精美的包装和高效的服务为众多品牌提供了美丽的外衣。您的投资将用于企业经营流动资金周转。",
        star: 4.5
    },{
        title: "生态旅游业老牌企业",
        url: "main/juheDetail/7",
        id: "7",
        imgsrc: "images/business/list7.png",
        content: "逃出钢筋混凝土铸成的城市,感受自然，享受淳朴的农家美食。企业将美好的景色，美丽的回忆，优质的旅游服务带给旅游者，而您的投资将用于企业经营流动资金周转。",
        star: 5
    },{
        title: "电商供应链运营管理专家",
        url: "main/juheDetail/4",
        id: "4",
        imgsrc: "images/business/list4.png",
        content: "近年来电商发展突飞猛进，物流行业也迎来了盛春，我们每个人已不可避免地参与到了这个链条中。企业为国内知名物流企业旗下供应链运营服务公司,您的投资主要用于企业扩大公司规模及建设发展。",
        star: 4.5
    },{
        title: "蓝宝石产业高新技术企业",
        url: "main/juheDetail/3",
        id: "3",
        imgsrc: "images/business/list3.png",
        content: "国强则民富，一个国家的强大也离不开这个国家的公民和企业，也许你不知道自己也为国防贡献出了力量。企业致力于生产高质量的蓝宝石，该产品广泛应用于国防事业，您的投资将用于企业生产及经营流动资金。",
        star: 5
    },{
        title: "半导体行业知名企业",
        url: "main/juheDetail/1",
        id: "1",
        imgsrc: "images/business/list1.png",
        content: "闪烁的霓虹并非只是虚无的发光体，背后是来自现代科技的温度。企业专注于LED全产业链，主要经营半导体材料的研发、制造和销售，您的投资款将助力企业生产经营流动资金的周转。",
        star: 4.5
    },{
        title: "专业滤清器生产企业",
        url: "main/juheDetail/5",
        id: "5",
        imgsrc: "images/business/list5.png",
        content: "车水马龙的大街，您可能想不到自已也是这繁华动力的关键。企业专业从事滤清器研发、生产、销售和服务的综合性企业，广泛应用于汽车等领域，您的投资主要用于企业研发和生产所需的费用。",
        star: 5
    },{
        title: "现代化茶业龙头企业",
        url: "main/juheDetail/2",
        id: "2",
        imgsrc: "images/business/list2.png",
        content: "每一缕茶香，都源自辛勤的劳动，其实也与您有着千丝万缕的关系。该企业是为中高端茶叶种植加工、专卖连锁、休闲茶楼、茶文化研讨等生态的综合型企业，您的投资将用于企业茶园种植和培育资金。",
        star: 4.5
    }]
}]);
