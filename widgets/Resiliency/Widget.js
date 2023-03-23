jsonCategories = 'widgets/Resiliency/data/categories.json'
jsonLayers     = 'widgets/Resiliency/data/opendatalayers.json'

var dCounties = [  // COUNTYNBR
  { label: "Weber    ", value: "29" },
  { label: "Davis    ", value: "06" },
  { label: "Salt Lake", value: "18" },
  { label: "Utah     ", value: "25" }
];

var sClickOnMapText = "<FONT COLOR=\"red\"><i>Click on one or more cities to start</i></FONT>";
var sClickOnMapToAddMoreText = "<br/><i>To remove city, click on name in list. To add another city, click on it in map.</i>";
var sSelectOptionAboveText = "<i>Select option above.</i>";

var aCommunityNames = [];

var dCommunities = [];

var sDistrictRGB = "rgba(102,102,229,0.6)"; //Blue color for to districts. Last value perhaps opacity?

var sClickConfirmation = "Use mouse to select district(s) on map. Do not click on district label. Click button when done.";

var dLandUseFilter = [
  { label: "All Land Uses", value: "'AG','EM','OS','CH','SF','MF','GQ','GO','ED','HE','RE','OF','IN','OT','UT','NB','NO'" },
  { label: "Single-Family Residential", value: "'CH','SF'" },
  //  { label: "All Other Land Uses"      , value: "'MF','GQ','GO','ED','HE','RE','OF','IN'"                                             }
  { label: "All Other Land Uses", value: "'AG','EM','OS','MF','GQ','GO','ED','HE','RE','OF','IN','OT','UT','NB','NO'" }
];

var aCategories = ['CM', 'CU', 'CC', 'CN', 'AA', 'AT', 'TT', 'TF', 'TA', 'AC', 'AH', 'AE', 'AG', 'AM', 'AP'];
var aCategories_Names = ['Metropolitan Centers', 'Urban Centers', 'City Centers', 'Neighborhood Centers', 'Auto Access to Jobs', 'Transit Access to Jobs', 'Transit', 'Freeway Access', 'Active Transportation Facilities', 'Child Care', 'Health Care', 'Schools', 'Grocery', 'Community Centers', '10-Minute Walk to Parks'];
var aCategories_Groups = ['places', 'places', 'places', 'places', 'access', 'access', 'transp', 'transp', 'transp', 'necess', 'necess', 'necess', 'necess', 'necess', 'necess'];

var dDisplayDict = [
  ['CM', 'Metropolitan Centers', 'KeepScoresOn'],
  ['CU', 'Urban Centers', 'KeepScoresOn'],
  ['CC', 'City Centers', 'KeepScoresOn'],
  ['CN', 'Neighborhood Centers', 'KeepScoresOn'],
  ['AA', 'Accessible Jobs - Auto', 'KeepScoresOn'],
  ['AT', 'Accessible Jobs - Transit', 'KeepScoresOn'],
  ['TT', 'Local Bus Stops', 'KeepScoresOn'],
  ['TT', 'CRT Stops', 'KeepScoresOn'],
  ['TT', 'CRT Stops - Future', 'KeepScoresOn'],
  ['TT', 'LRT Stops', 'KeepScoresOn'],
  ['TT', 'LRT Stops - Future', 'KeepScoresOn'],
  ['TT', 'BRT Stops', 'KeepScoresOn'],
  ['TT', 'BRT Stops - Future', 'KeepScoresOn'],
  ['TF', 'Interchanges', 'KeepScoresOn'],
  ['TF', 'Interchanges - Future', 'KeepScoresOn'],
  ['TA', 'Active Transportation Paths', 'KeepScoresOn'],
  ['TA', 'Active Transportation Paths - Future', 'KeepScoresOn'],
  ['TA', 'Active Transportation Protected Bike Lanes', 'KeepScoresOn'],
  ['TA', 'Active Transportation Protected Bike Lanes - Future', 'KeepScoresOn'],
  ['AC', 'Child Care', 'KeepScoresOn'],
  ['AH', 'Health Care', 'KeepScoresOn'],
  ['AG', 'Grocery Stores', 'KeepScoresOn'],
  ['AE', 'K-12 Public Schools', 'KeepScoresOn'],
  ['AE', 'Higher Education', 'KeepScoresOn'],
  ['AM', 'Community Centers', 'KeepScoresOn'],
  ['AP', '10-Minute Walk to Parks', 'KeepScoresOn']
]

var aCategoryWeights = [];

// need some kind of container to save weights so that toggling between communities with or without the category, the value is saved somewhere....
// use aCategories as index array
var aCategoryWeights_Saved = ['1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000', '1.0000'];

var sCurCommunities = "";
var dCurCommunities = [];
var lyrProject;
var lyrProject_Selected;
var sCommunityLayer = 'Communities';
var sCommunityLayer_Selected = 'Communities-Selected';

var lyrParcelPieces;
var sParcelPiecesLayer = 'Housing ATO';

var curLandUseFilter = "'AG','EM','OS','CH','SF','MF','GQ','GO','ED','HE','RE','OF','IN','OT','UT','NB','NO'"

// which cities have utah qualified opportunity zones
var UtahQualOppZoneCities = "'OG','SO'"

var wR;
var maxScore_Places = 0.0;
var maxScore_Access = 0.0;
var maxScore_Transp = 0.0;
var maxScore_Necess = 0.0;
var maxPossible = 0.0;
var iPixelSelectionTolerance = 5;
var curParcelPieceUNIQID = 0;

var WIDGETPOOLID_LEGEND = 0;
var WIDGETPOOLID_SCORE = 2;

var bLocationGraphic = false;

var curCommSelMode = 'single';

var cmbCommunities_Single;
var cmbCommunities_Multi;
var cmbCounty;

var strSelectedPriorities = '';

define(['dojo/_base/declare',
  'dojo/dom',
  'dojo/dom-style',
  'dojo/dom-construct',
  'dojo/on',
  'dijit/registry',
  'jimu/BaseWidget',
  'dijit/form/CheckBox',
  'dojo/html',
  'dojo/domReady!',
  'esri/layers/FeatureLayer',
  'jimu/LayerInfos/LayerInfos',
  'dijit/form/Select',
  'dijit/form/Button',
  'dijit/form/ComboBox',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/geometry/Extent',
  'esri/renderers/UniqueValueRenderer',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/Color',
  'jimu/PanelManager',
  'esri/graphic',
  'dojo/store/Memory'],
  function (declare, dom, domStyle, domConstruct, on, registry, BaseWidget, CheckBox, html, domReady, FeatureLayer, LayerInfos, Select, Button, ComboBox, Query, QueryTask, Extent, UniqueValueRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, PanelManager, Graphic, Memory) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      startup: function () {
        this.inherited(arguments);
        //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
        console.log('startup');

        wR = this;
        this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature

        dom.byId('addText').innerHTML = sClickOnMapText;

        // Initialize Selection Layer, FromLayer, and ToLayer and define selection colors
        var layerInfosObject = LayerInfos.getInstanceSync();
        for (var j = 0, jl = layerInfosObject._layerInfos.length; j < jl; j++) {
          var currentLayerInfo = layerInfosObject._layerInfos[j];
          if (currentLayerInfo.title == sCommunityLayer) {
            lyrProject = layerInfosObject._layerInfos[j].layerObject;
            console.log(sCommunityLayer + ' Found');
          } else if (currentLayerInfo.title == sCommunityLayer_Selected) {
            lyrProject_Selected = layerInfosObject._layerInfos[j].layerObject;
            lyrProject_Selected.setDefinitionExpression("CommCode IN ('NONE')");
            lyrProject_Selected.show();
            console.log(sCommunityLayer_Selected + ' Found');
          } else if (currentLayerInfo.title == sParcelPiecesLayer) {
            lyrParcelPieces = layerInfosObject._layerInfos[j].layerObject;
            lyrParcelPieces.setDefinitionExpression("CommCode IN ('NONE')");
            lyrParcelPieces.show();
            console.log('Parcel Pieces Layer Found')
          }
        }


        // Populate categories object
        dojo.xhrGet({
          url: jsonCategories,
          handleAs: "json",
          load: function (obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log(jsonCategories);
            dCategories = obj.data;
            wR._buildMenu();
          },
          error: function (err) {
            /* this will execute if the response couldn't be converted to a JS object,
               or if the request was unsuccessful altogether. */
          }
        });

        // Populate categories object
        dojo.xhrGet({
          url: jsonLayers,
          handleAs: "json",
          load: function (obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log(jsonLayers);
            dLayers = obj.data;
            wR._buildMenu();
          },
          error: function (err) {
            /* this will execute if the response couldn't be converted to a JS object,
               or if the request was unsuccessful altogether. */
          }
        });

        //// Populate projects
        //dojo.xhrGet({
        //  url: jsonProjects,
        //  handleAs: "json",
        //  load: function (obj) {
        //    /* here, obj will already be a JS object deserialized from the JSON response */
        //    console.log(jsonProjects);
        //    dProjects = obj;
        //  },
        //  error: function (err) {
        //    /* this will execute if the response couldn't be converted to a JS object,
        //       or if the request was unsuccessful altogether. */
        //  }
        //});

        //setup click functionality
        this.map.on('click', selectParcelPiece);

        function pointToExtent(map, point, toleranceInPixel) {
          var pixelWidth = wR.map.extent.getWidth() / wR.map.width;
          var toleranceInMapCoords = toleranceInPixel * pixelWidth;
          return new Extent(point.x - toleranceInMapCoords,
            point.y - toleranceInMapCoords,
            point.x + toleranceInMapCoords,
            point.y + toleranceInMapCoords,
            wR.map.spatialReference);
        }

        //Setup function for selecting communities and parcels

        function selectParcelPiece(evt) {
          console.log('selectParcelPiece');

          var query = new Query();
          query.geometry = pointToExtent(wR.map, evt.mapPoint, iPixelSelectionTolerance);
          query.returnGeometry = false;
          query.outFields = ["*"];

          var queryCommunity = new QueryTask(lyrProject.url);
          queryCommunity.execute(query, clickCommunity);

          //Segment search results
          function clickCommunity(results) {
            console.log('clickCommunity');

            var resultCount = results.features.length;
            if (resultCount > 0) {
              var _communityCode = results.features[0].attributes['CommCode'];

              // if community is not already selected, add it to the list
              if (dCurCommunities.indexOf(_communityCode) == -1) {
                var _communitiesText = dom.byId('communitiesText');

                var _communityName = dCommunities.find(item => item.value == _communityCode).label;
                dCurCommunities.push(_communityCode);
                sCurCommunities = "'" + dCurCommunities.join("','") + "'";

                //change selection
                lyrProject_Selected.setDefinitionExpression('CommCode IN (' + sCurCommunities + ')')
                lyrProject.setDefinitionExpression('CommCode NOT IN (' + sCurCommunities + ')')

                wR._afterChangeCommunity();

                // after
                dojo.place("<div class = \"community\" id=\"comm_" + _communityCode + "\">" + _communityName + "</div>", "communitiesText");

                dom.byId("comm_" + _communityCode).onclick = function (evt) {
                  console.log('Remove ' + _communityCode);

                  dojo.destroy("comm_" + _communityCode);

                  const index = dCurCommunities.indexOf(_communityCode);
                  if (index > -1) { // only splice array when item is found
                    dCurCommunities.splice(index, 1); // 2nd parameter means remove one item only
                  }
                  sCurCommunities = "'" + dCurCommunities.join("','") + "'";

                  if (dCurCommunities.length == 0) {
                    dom.byId('addText').innerHTML = sClickOnMapText;
                  }

                  //change selection
                  lyrProject_Selected.setDefinitionExpression('CommCode IN (' + sCurCommunities + ')')
                  lyrProject.setDefinitionExpression('CommCode NOT IN (' + sCurCommunities + ')')
                  wR._afterChangeCommunity();

                };

                dom.byId('addText').innerHTML = sClickOnMapToAddMoreText;

                // if community is already selected, query the parcel layer and show score
              } else {
                var queryParcelPiece = new QueryTask(lyrParcelPieces.url);
                queryParcelPiece.execute(query, clickParcelPiece);

                //Segment search results
                function clickParcelPiece(results) {
                  console.log('clickParcelPiece');

                  var resultCount = results.features.length;
                  if (resultCount > 0) {
                    //use first feature only
                    var featureAttributes = results.features[0].attributes;
                    curParcelPieceUNIQID = featureAttributes['OBJECTID'];

                    var symbol = new SimpleMarkerSymbol().setSize(15).setColor(new Color("#6b39fd"));

                    var graphic = new Graphic(evt.mapPoint);

                    graphic.setSymbol(symbol);
                    //graphic.geometry = evt.mapPoint;
                    //graphic.setInfoTemplate(popupTemplate);
                    if (bLocationGraphic) {
                      // should only be one graphic in addition to communities at a time (community borders and selection)
                      // so remove the last
                      //wR.map.graphics.remove(wR.map.graphics.graphics[wR.map.graphics.graphics.length-1]);
                      wR.map.graphics.clear();
                      bLocationGraphic = false;
                    }
                    wR.map.graphics.add(graphic);
                    bLocationGraphic = true;

                    // Open scoring widget
                    var pm = PanelManager.getInstance();

                    //Close Segment Widget if open
                    //for (var p=0; p < pm.panels.length; p++) {
                    //    if (pm.panels[p].label == sSegWidgetLabel) {
                    //        pm.closePanel(pm.panels[p]);
                    //      }
                    //}

                    //Open scoring widget
                    pm.showPanel(wR.appConfig.widgetPool.widgets[WIDGETPOOLID_SCORE]);

                    wR.publishData({
                      message: curParcelPieceUNIQID
                    });
                  }
                }
              }
            }
          }
        }
      },

      _showLegend: function () {
        var pm = PanelManager.getInstance();
        pm.showPanel(wR.appConfig.widgetPool.widgets[WIDGETPOOLID_LEGEND]);
        //Close Location Scores if open
        var pm = PanelManager.getInstance();
        for (var p = 0; p < pm.panels.length; p++) {
          if (pm.panels[p].label == 'Location Scores') {
            pm.closePanel(pm.panels[p]);
          }
        }
      },

      _afterChangeCommunity: function () {
        console.log('_afterChangeCommunity');
        // after sCurCommunities updated
        if (sCurCommunities == "''" || sCurCommunities == "'__'") {

          //Close Location Scores if open
          var pm = PanelManager.getInstance();
          for (var p = 0; p < pm.panels.length; p++) {
            if (pm.panels[p].label == 'Legend') {
              pm.closePanel(pm.panels[p]);
            }
          }

        }

        wR._updateOppZoneDisplay();

        if (sCurCommunities != "") {
          wR._zoomToCommunity();
          wR._checkCommunityNAs();
        }
        wR._updateDisplay();
        wR._turnOnOffLayers();

        //Close Location Scores if open
        var pm = PanelManager.getInstance();
        for (var p = 0; p < pm.panels.length; p++) {
          if (pm.panels[p].label == 'Location Score') {
            pm.closePanel(pm.panels[p]);
          }
        }
      },

      _checkCommunityNAs: function () {
        // check what centers are in a community and update user interface as appropriate
        for (i = 0; i < aCategories.length; i++) {

          // initialize as hidden
          dom.byId('row' + aCategories[i]).style.display = 'none';
          dom.byId('none' + aCategories[i]).style.display = 'table-row';
          dom.byId('rank' + aCategories[i]).value = '0.0000';
          dom.byId('chk' + aCategories[i]).checked = false;

          // check if communities have categories
          for (j = 0; j < dCurCommunities.length; j++) {
            _catsincommunity = dCommunities.find(item => item.value == dCurCommunities[j]).categories
            if (_catsincommunity.includes(aCategories[i])) {
              dom.byId('row' + aCategories[i]).style.display = 'table-row';
              dom.byId('none' + aCategories[i]).style.display = 'none';
              //use saved value, which is last manually selected by user
              dom.byId('rank' + aCategories[i]).value = aCategoryWeights_Saved[i];
              // break out if one community has score available
              break;
            }
          }
        }

      },

      _updateDisplay: function () {
        console.log('_updateDisplay');

        // filter by Community Code and Building Code
        _strFilterExpression = "CommCode IN (" + sCurCommunities + ") AND BC IN (" + curLandUseFilter + ")"

        // add opportunity zone filter
        if (dom.byId('opportunityzones').value == 'Y') {
          _strFilterExpression = _strFilterExpression + " AND OZ=1"
        }
        lyrParcelPieces.setDefinitionExpression(_strFilterExpression);

        // build expression for symbology based on each categories rank
        var _scoreExp = '';
        var _strHig = '';
        var _strMed = '';
        var _strLow = '';

        maxScore_Places = 0.0;
        maxScore_Access = 0.0;
        maxScore_Transp = 0.0;
        maxScore_Necess = 0.0;

        maxPossible = 0.0;

        aCategoryWeights = [];

        for (let i = 0; i < aCategories.length; i++) {
          _value = parseFloat(dom.byId('rank' + aCategories[i]).value);
          _scoreExp += " $feature." + aCategories[i] + " * " + String(_value)

          aCategoryWeights.push(_value);

          switch (aCategories_Groups[i]) {
            case 'places':
              if (_value > maxScore_Places) { // can't add max since these places never overlap
                maxScore_Places = _value;
              }
              break;
            case 'access':
              maxScore_Access += _value;
              break;
            case 'transp':
              maxScore_Transp += _value;
              break;
            case 'necess':
              maxScore_Necess += _value;
              break;
          }

          // for all but last item add plus(+) sign between expressions
          if (i != aCategories.length - 1) {
            _scoreExp += " + ";
          }

          switch (dom.byId('rank' + aCategories[i]).value) {
            case '0.3333':
              _strLow += aCategories_Names[i] + ", ";
              break;
            case '0.6667':
              _strMed += aCategories_Names[i] + ", ";
              break;
            case '1.0000':
              _strHig += aCategories_Names[i] + ", ";
              break;
          }

        }

        maxPossible = maxScore_Places + maxScore_Access + maxScore_Transp + maxScore_Necess;

        if (_strHig.length > 0 && _strMed.length > 0 && _strLow.length > 0) {
          strSelectedPriorities = 'High Priority: ' + _strHig.substring(0, _strHig.length - 2) + " -- " + 'Medium Priority: ' + _strMed.substring(0, _strMed.length - 2) + " -- " + 'Low Priority: ' + _strLow.substring(0, _strLow.length - 2);
        } else if (_strHig.length > 0 && _strMed.length > 0 && _strLow.length == 0) {
          strSelectedPriorities = 'High Priority: ' + _strHig.substring(0, _strHig.length - 2) + " -- " + 'Medium Priority: ' + _strMed.substring(0, _strMed.length - 2);
        } else if (_strHig.length > 0 && _strMed.length == 0 && _strLow.length > 0) {
          strSelectedPriorities = 'High Priority: ' + _strHig.substring(0, _strHig.length - 2) + " -- " + 'Low Priority: ' + _strLow.substring(0, _strLow.length - 2);
        } else if (_strHig.length == 0 && _strMed.length > 0 && _strLow.length > 0) {
          strSelectedPriorities = 'Medium Priority: ' + _strMed.substring(0, _strMed.length - 2) + " -- " + 'Low Priority: ' + _strLow.substring(0, _strLow.length - 2);
        } else if (_strHig.length > 0 && _strMed.length == 0 && _strLow.length == 0) {
          strSelectedPriorities = 'High Priority: ' + _strHig.substring(0, _strHig.length - 2);
        } else if (_strHig.length > 0 && _strMed.length == 0 && _strLow.length == 0) {
          strSelectedPriorities = 'Medium Priority: ' + _strMed.substring(0, _strMed.length - 2);
        } else if (_strHig.length == 0 && _strMed.length == 0 && _strLow.length > 0) {
          strSelectedPriorities = 'Low Priority: ' + _strLow.substring(0, _strLow.length - 2);
        } else {
          strSelectedPriorities = '';
        }

        var vcUVRenderer = new UniqueValueRenderer({
          type: "unique-value",  // autocasts as new UniqueValueRenderer()
          valueExpression: "" +
            "var score = (" + _scoreExp + ')/' + maxPossible + ";" +
            "if      (score>0.80) { return 'class_5'; }" +
            "else if (score>0.60) { return 'class_4'; }" +
            "else if (score>0.40) { return 'class_3'; }" +
            "else if (score>0.20) { return 'class_2'; }" +
            "else                 { return 'class_1'; }",
          uniqueValueInfos: [
            { value: "class_5", label: "Most Accessibility (80-100% of Max Possible)", symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([255, 255, 255]), 5), new Color("#031273")) },
            { value: "class_4", label: "High Accessibility (60-80% of Max Possible)", symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([255, 255, 255]), 5), new Color("#2c7fb8")) },
            { value: "class_3", label: "Middle Accessibility (40-60% of Max Possible)", symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([255, 255, 255]), 5), new Color("#52c7d5")) },
            { value: "class_2", label: "Low Accessibility (20-40% of Max Possible)", symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([255, 255, 255]), 5), new Color("#a1dab4")) },
            { value: "class_1", label: "Least Accessibility (0-20% of Max Possible)", symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([255, 255, 255]), 5), new Color("#ffffcc")) }
          ]

        });
        lyrParcelPieces.setRenderer(vcUVRenderer);

        //        wR._createChart(_strFilterExpression, _scoreExp);

      },

      //    _createChart: function(_strFilterExpression, _scoreExp) {
      //        console.log('_createChart');
      //
      //        var query = new Query();  
      //        query.returnGeometry = false;
      //        query.outFields = ["*"];
      //        query.where = _strFilterExpression;
      //
      //        var queryParcelPiece = new QueryTask(lyrParcelPieces.url);
      //        queryParcelPiece.execute(query,getAreasByClass);
      //        
      //        //Segment search results
      //        function getAreasByClass(results) {
      //            console.log('getAreasByClass');
      //        
      //            _area_class5 = 0;
      //            _area_class4 = 0;
      //            _area_class3 = 0;
      //            _area_class2 = 0;
      //            _area_class1 = 0;
      //
      //            var resultCount = results.features.length;
      //            if (resultCount>0) {
      //                //use first feature only
      //                for (i=0;i<resultCount;i++) {
      //                    var featureAttributes = results.features[0].attributes;
      //    
      //                    _score = (featureAttributes[aCategories[00]] * aCategoryWeights[00]) + 
      //                             (featureAttributes[aCategories[01]] * aCategoryWeights[01]) + 
      //                             (featureAttributes[aCategories[02]] * aCategoryWeights[02]) + 
      //                             (featureAttributes[aCategories[03]] * aCategoryWeights[03]) + 
      //                             (featureAttributes[aCategories[04]] * aCategoryWeights[04]) + 
      //                             (featureAttributes[aCategories[05]] * aCategoryWeights[05]) + 
      //                             (featureAttributes[aCategories[06]] * aCategoryWeights[06]) + 
      //                             (featureAttributes[aCategories[07]] * aCategoryWeights[07]) + 
      //                             (featureAttributes[aCategories[08]] * aCategoryWeights[08]) + 
      //                             (featureAttributes[aCategories[09]] * aCategoryWeights[09]) + 
      //                             (featureAttributes[aCategories[10]] * aCategoryWeights[10]) + 
      //                             (featureAttributes[aCategories[11]] * aCategoryWeights[11]) + 
      //                             (featureAttributes[aCategories[12]] * aCategoryWeights[12]) + 
      //                             (featureAttributes[aCategories[13]] * aCategoryWeights[13]) + 
      //                             (featureAttributes[aCategories[14]] * aCategoryWeights[14]) ;
      //    
      //                    if        (_score>maxPossible*0.80) {
      //                        _area_class5 += featureAttributes['Shape__Area'];
      //                    } else if (_score>maxPossible*0.60) {
      //                        _area_class4 += featureAttributes['Shape__Area'];
      //                    } else if (_score>maxPossible*0.40) {
      //                        _area_class3 += featureAttributes['Shape__Area'];
      //                    } else if (_score>maxPossible*0.20) {
      //                        _area_class2 += featureAttributes['Shape__Area'];
      //                    } else                               {
      //                        _area_class1 += featureAttributes['Shape__Area'];
      //                    }
      //                }
      //            }
      //            console.log('class5area: ' + String(_area_class5));
      //            console.log('class4area: ' + String(_area_class4));
      //            console.log('class3area: ' + String(_area_class3));
      //            console.log('class2area: ' + String(_area_class2));
      //            console.log('class1area: ' + String(_area_class1));
      //        }
      //    },

      _updateOppZoneDisplay: function () {
        console.log('_updateOppZoneDisplay');
        for (i = 0; i < dCurCommunities.length; i++) {
          if (dCommunities.find(item => item.value == dCurCommunities[i]).oppzones == 'yes') {
            dom.byId("oppzones").style.display = 'block';
            break;
          } else {
            dom.byId("oppzones").style.display = 'none';
          }

        }
      },

      _turnOnOffLayers: function () {
        console.log('_turnOnOffLayers')
        // turn on/off data layers

        var _bTurnScoresOff = false;

        // loop through all layers in map
        var layerInfosObject = LayerInfos.getInstanceSync();
        for (var j = 0, jl = layerInfosObject._layerInfos.length; j < jl; j++) {
          var _curLayerInfo = layerInfosObject._layerInfos[j];
          var _curLayerTitle = _curLayerInfo.title;

          // loop through display dictionary and check against layer name
          for (var k = 0; k < dDisplayDict.length; k++) {

            // if dictionary item equals current category
            if (dDisplayDict[k][1] == _curLayerTitle) {

              // check if item checked
              if (dom.byId('chk' + dDisplayDict[k][0]).checked == true) {
                _curLayerInfo.layerObject.show()
                if (dDisplayDict[k][2] == 'TurnScoresOff') {
                  _bTurnScoresOff = true;
                }
              } else {
                _curLayerInfo.layerObject.hide()
              }
            }
          }
        }
        //if (_bTurnScoresOff==true) {
        //    lyrParcelPieces.hide();
        //} else {
        //    lyrParcelPieces.show();
        //}
        //if (sCurCommunities=="''" || sCurCommunities=="'__'") {
        //    lyrProject.show();
        //} else {
        //    lyrProject.hide();
        //}
      },

      _expandCenters: function () {
        console.log('_expandCenters');
        if (dom.byId("divCentersExpand").innerHTML == 'collapse') {
          dom.byId("centerschoices").style.display = 'none';
          dom.byId("divCentersExpand").innerHTML = 'expand';
        } else {
          dom.byId("centerschoices").style.display = 'block';
          dom.byId("divCentersExpand").innerHTML = 'collapse';
        }
      },



      _expandATO: function () {
        console.log('_expandATO');
        if (dom.byId("divATOExpand").innerHTML == 'collapse') {
          dom.byId("atochoices").style.display = 'none';
          dom.byId("divATOExpand").innerHTML = 'expand';
        } else {
          dom.byId("atochoices").style.display = 'block';
          dom.byId("divATOExpand").innerHTML = 'collapse';
        }
      },

      _expandTransportation: function () {
        console.log('_expandTransportation');
        if (dom.byId("divTransportationExpand").innerHTML == 'collapse') {
          dom.byId("transportationchoices").style.display = 'none';
          dom.byId("divTransportationExpand").innerHTML = 'expand';
        } else {
          dom.byId("transportationchoices").style.display = 'block';
          dom.byId("divTransportationExpand").innerHTML = 'collapse';
        }
      },

      _expandAmenities: function () {
        console.log('_expandAmenities');
        if (dom.byId("divAmenitiesExpand").innerHTML == 'collapse') {
          dom.byId("amenitieschoices").style.display = 'none';
          dom.byId("divAmenitiesExpand").innerHTML = 'expand';
        } else {
          dom.byId("amenitieschoices").style.display = 'block';
          dom.byId("divAmenitiesExpand").innerHTML = 'collapse';
        }
      },

      _zoomToCommunity: function () {
        console.log('_zoomToCommunity');

        queryTask = new esri.tasks.QueryTask(lyrProject.url);

        query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        //query.where = "CommCode IN (" + sCurCommunities + ") AND COUNTYNBR='" + curCountyNumber + "'"; // ONLY SETUP FOR WASATCH FRONT AREA
        query.where = "CommCode IN (" + sCurCommunities + ")"; // ONLY SETUP FOR WASATCH FRONT AREA

        queryTask.execute(query, showResults);

        function showResults(featureSet) {

          var feature, featureId;

          // QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
          if (featureSet.features.length > 0) {
            if (featureSet.features[0].geometry.type == "polyline" || featureSet.features[0].geometry.type == "polygon") {
              // clearing any graphics if present. 
              wR.map.graphics.clear();
              newExtent = new Extent(featureSet.features[0].geometry.getExtent())
              for (i = 0; i < featureSet.features.length; i++) {
                var graphic = featureSet.features[i];
                var thisExtent = graphic.geometry.getExtent();

                // making a union of extent or previous feature and current feature. 
                newExtent = newExtent.union(thisExtent);
                //var _sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                //    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                //    new Color("#6b39fd"), 5),new Color([0,0,0,0])
                //);
                //graphic.setSymbol(_sfs); 
                //graphic.setInfoTemplate(popupTemplate); 
                //wR.map.graphics.add(graphic); 
              }


              if (dom.byId("chkAutoZoom").checked == true) {
                //if (dom.byId("chkAutoPan").checked == true) {
                // zoom to new extent
                wR.map.setExtent(newExtent.expand(1.5));
                // pan to center of TAZ
                //wR.map.centerAt(newExtent.getCenter()); //recenters the map based on a map coordinate.
                //}
              }
            }
          }
        }
      },

      //Run when receiving a message
      onReceiveData: function (name, widgetId, data, historyData) {
        //filter out messages
        if (name == 'Location Score') {
          if (data.message == 'remove_location') {
            if (bLocationGraphic) {
              // should only be one graphic in addition to communities at a time (community borders and selection)
              // so remove the last
              wR.map.graphics.remove(wR.map.graphics.graphics[wR.map.graphics.graphics.length - 1]);
              bLocationGraphic = false;
            }
          }
          return;
        }
      },

      _turnoffall: function () {
        for (let i = 0; i < aCategories.length; i++) {
          dom.byId('rank' + aCategories[i]).value = "0.0000";
          aCategoryWeights_Saved[i] = "0.0000";
        }
        wR._updateDisplay();
      },

      _buildMenu: function() {
        console.log('_buildMenu');
        

        // check if data object populated
        if (typeof dCategories !== "undefined" && typeof dLayers !== "undefined") {

          var divMenu = dom.byId("menu");
          
          dojo.forEach(dijit.findWidgets(divMenu), function(w) {
            w.destroyRecursive();
          });
          
          dojo.empty(divMenu);

          for (c in dCategories) {


            dojo.place("<br/>", "menu");

            bId = "button" + dCategories[c].CategoryCode;

            var button3 = new Button({ label:'▶', id:bId, style:"display:inline"});

            button3.startup();
            button3.placeAt(divMenu);
            button3.on("click", this._expand);

            dojo.style(bId,"width","18px");
            dojo.style(bId,"height","16px");
            //dojo.style(bId,"display","inline-block");

            //dojo.style(bId,"background",sBGColor);
            //dojo.style(bId,"color",sFGColor);
            
            // category heading
            dojo.place("<div class = \"grouptitle\" style=\"display:inline\"><p class=\"thicker\" style=\"display:inline\">" + dCategories[c].CategoryName + "</div><br/>", "menu");

            divCatName = "cat" + dCategories[c].CategoryCode

            var divCat = domConstruct.create("div",{id:divCatName});

            divCat.style.display='none';

            divMenu.appendChild(divCat);

            // layers div
            dojo.place("<div style=\"display: none;\" id=\"div_" + dCategories[c].CategoryCode +  "\"", divCatName);

            // layers heading
            dojo.place("<hr>&nbsp;&nbsp;&nbsp;<b>Priority&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Layer Name</b><hr>", divCatName);

            _layers = dLayers.filter(o => o['CategoryCode'] == dCategories[c].CategoryCode);

            for (l in _layers) {
              dojo.place("<p style=\"display:inline\">&nbsp;&nbsp;</p>", divCatName);
              new Select({
                name: "select" + _layers[l].LayerCode,
                options: [
                  { label: "High"  , value: "1.0000", selected: true },
                  { label: "Medium", value: "0.6667"                 },
                  { label: "Low"   , value: "0.3333"                 },
                  { label: "Exclue", value: "0.0000"                 }
                ]
              }).placeAt(divCatName);
              dojo.place('<span">&nbsp;' + _layers[l].LayerName + "</span><br/>", divCatName);
            }
          }
        }

        //for (var k = 0; k < 2; k++) {
        //  
        //  
        //  for (var l = 0; l < aResultGroup.length; l++) {
        //    if (aGroups[j] == aResultGroup[l] && aCategories[k] == aResultCategories[l]) {
        //        
        //      if (aResultTiers[l] == 1) {
        //        sBGColor="#ED2024";
        //        sFGColor="#FFFFFF";
        //      } else if (aResultTiers[l] == 2) {
        //        sBGColor="#37A949";
        //        sFGColor="#FFFFFF";
        //      } else if (aResultTiers[l] == 3) {
        //        sBGColor="#37C2F1";
        //        sFGColor="#FFFFFF";
        //      } else {
        //        sBGColor="#222222";
        //        sFGColor="#FFFFFF";
        //      }
        //      
        //      var button3 = new Button({ label:aResultRefLabel[l], id:"button_" + aResultRefLabel[l]});
        //      button3.startup();
        //      button3.placeAt(divResults);
        //      button3.on("click", this.ZoomToCorridor);
        //      
        //      dojo.style("button_" + aResultRefLabel[l],"width","40px");
        //      dojo.style("button_" + aResultRefLabel[l],"height","16px");
        //      dojo.style("button_" + aResultRefLabel[l],"background",sBGColor);
        //      dojo.style("button_" + aResultRefLabel[l],"color",sFGColor);
        //      
        //      dojo.place("<div class = \"corridoritem\">&nbsp;&nbsp;" + aResultNames[l] + "</div></br>", "resultssection");
        //      
        //      //dojo.create("div", { id:, innerHTML: "<p>hi</p>" }, "divResults");
        //      
        //      //divResults.innerHTML += "</br>";
        //      
        //    }
        //  }
        //  dojo.place("</br></br></br>", "resultssection");
        //}
      },

      _expand: function() {
        console.log('_expand');

        var myBut = registry.byId("button" + this.id.slice(-2));
        var divCat = dom.byId("cat" + this.id.slice(-2));

        if (divCat.style.display=='none') {
          divCat.style.display='block';
          myBut.set('label','▼');
        } else {
          divCat.style.display='none';
          myBut.set('label','▶');
        }
        
      }

      // onOpen: function(){
      //   console.log('onOpen');
      // },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }
    });
  });