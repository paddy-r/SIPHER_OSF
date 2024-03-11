

    
    var names = ["EmpRate","QualProportion","LTsick","digital","MaxMinRatio","Access","ratio_80_20","AffRatio","child_poverty","food","Decent","Turnout","PermEmp","tdr","sr","le_both","le_var_abs_both","le_var_rel_both","le_male","le_var_abs_male","le_var_rel_male","le_female","le_var_abs_female","le_var_rel_female","Cluster"]


    var display_names = [
    "1A: Participation in paid employment",
    "1B: Skills and qualifications",
    "2A: Involuntary exclusion from the labour market",
    "2B: Digital exclusion",
    "3A: Wealth inequality",
    "3B: Physical connectivity",
    "4A: Earnings inequality",
    "4B: Housing affordability",
    "5A: Poverty",
    "5B: Costs of living",
    "6A: Decent pay",
    "6B: Inclusion in decision-making",
    "7A: Job security/precarity",
    "Total dependency ratio (TDR)",
    "Sex ratio (SR)",
    "Life expectancy (years), both sexes",
    "Lifespan variation (years), both sexes",
    "Lifespan variation (dimensionless), both sexes",
    "Life expectancy (years), males",
    "Lifespan variation (years), males",
    "Lifespan variation (dimensionless), males",
    "Life expectancy (years), females",
    "Lifespan variation (years), females",
    "Lifespan variation (dimensionless), females",
    "Clustering",
    ]

    var display_text = ["Percentage of working-age people (aged 16-64) who are employed",
    "Percentage of adults aged 20-49 with a Level 2 or higher National Vocational Qualification (NVQ)",
    "Percentage of working-age people (aged 16-64) who are inactive due to ill health or disability",
    "Percentage of individuals who are classified as a) e-withdrawn, b) passive and uncommitted internet users, or c) settled offline communities; based on the Internet User Classification (IUC)",
    "Ratio of median house prices in most expensive wards to median in least expensive",
    "Public transport accessibility measure, percentage of Lower Super Output Area (LSOAs)/Data Zones (DZs) within the local authority area that are among the 50% most accessible LSOAs/DZs for each devolved nation",
    "Ratio of weekly earnings for residents in full-time work between 80th and 20th percentiles",
    "Ratio of median house prices to median gross annual earnings",
    "Percentage of children living in low income households (based on national relative threshold, after adjustment for housing costs)",
    "Percentage of households that are defined as fuel poor, according to national definition",
    "Percentage of employee jobs that are paid below the Living Wage (as defined by the Living Wage Foundation)",
    "Percentage of eligible voters participating in local elections",
    "Percentage of employees on a permanent contract",
    "Ratio of the number of dependents aged zero to 14 and over 65, compared with the total population aged 15 to 64 \n  definition: (N(0-14) + N(65+)) / N(15-64)",
    "Ratio of the number of males to number of females \n  Definition: N(males) / N(females)",
    "Life expectancy at birth in years for both sexes combined",
    "Lifespan variation at birth in years – “e_dagger” – for both sexes combined",
    "Lifespan variation at birth, dimensionless – “Keyfitz Entropy” – for both sexes combined",
    "Life expectancy at birth in years for males",
    "Lifespan variation at birth in years – “e_dagger” – for males",
    "Lifespan variation at birth, dimensionless – “Keyfitz Entropy” – for males",
    "Life expectancy at birth in years for females",
    "Lifespan variation at birth in years – “e_dagger” – for females",
    "Lifespan variation at birth, dimensionless – “Keyfitz Entropy” – for females",
    "Four-cluster k-means solution, computed for 2020 only. \nThis is a grouping of local authorities according to similarities between values of the indicators \n  (1) Less inclusive (orange) \n  (2) More inclusive (blue)\n  (3) Average (green)\n  (4) Mix of extremes (yellow)"]

  

    var polarity =[1,1,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,2]
    var percentage = ["(%)","(%)","(%)","(%)","","(%)","","","(%)","(%)","(%)","(%)","(%)","(%)","","","","","","","","","","",""]

    // console.log(names.length,display_names.length);
    // load choice to dropdown
    var sel = document.getElementById("sel1")
    for (i = 0; i < names.length; i++) {
      sel.innerHTML += "<option>" + display_names[i] + "</option>"
      // console.log(display_names[i]);
    }

    var mapdata
    let zoom = d3.zoom().on("zoom", handleZoom);
    const svg = d3.select("#mapspace")
    var width = document.getElementById("mapContainer").clientWidth;
    svg.attr("width",width)
    const height = svg.attr("height");
    const mapspace = svg.append("g")
    mapspace.attr("id", "map")
    // Data and color scale
    let data = new Map()


   
    var attribute = 0
    var year = "2017"



    svg.attr("background-color: blue")
    svg.call(zoom)
    document.getElementById("yearRange").value = 2017

    const ledgend = d3.select("#ledgend")
    ledgend.attr("width",width)
    ledgend.append("g")



    // get choice
    var getValue = function () {
      var e = document.getElementById("sel1");
      attribute = e.selectedIndex
      // if (attribute == 0){
      //   attribute = 24
      // }else{
      //   attribute = attribute -1 
      // }
      // console.log(attribute);
      plot(attribute);
    }

    // get year
    var getYear = function () {
      var e = document.getElementById("yearRange");
      document.getElementById("yearLabel").innerHTML = "Year: "+e.value;
      year = e.value.toString()
      plot(attribute);
    }

    // Map and projection
    var projection = d3.geoTransverseMercator()
      .center([0, 55])
      .scale(2900)
      .translate([width / 1.4, height / 2])
      
    addEventListener("resize", (event) => {
        width = document.getElementById("mapContainer").clientWidth;
        svg.attr("width",width)
        projection.center([0, 55])
        .scale(2900)
        //.translate([width / 1.4, height / 2])
        console.log(width);
        //24
        ledgend.attr("width",width)
      });
  

    function handleZoom(e) {
      d3.select("#map").attr("transform", e.transform);
    }

    // get data the map and the csv
    Promise.all([
    d3.json("Data/converted2.json"),
      d3.csv("Data/data_long_imputed_with_clusters.csv", function (d) { data.set(d.LAD13CD + d.year, [d.EmpRate, d.QualProportion, d.LTsick, d.digital, d.MaxMinRatio, d.Access, d.ratio_80_20, d.AffRatio, d.child_poverty, d.food, d.Decent, d.Turnout, d.PermEmp, d.tdr,d.sr,d.le_both,d.le_var_abs_both,d.le_var_rel_both,d.le_male,d.le_var_abs_male,d.le_var_rel_male,d.le_female,d.le_var_abs_female,d.le_var_rel_female,d.Cluster,d.LAD21NM]) })
    ]).then(function (data) {
      mapdata = data
      plot(0)
    })
    document.getElementById("output").innerHTML ="Map loading please wait"
    var plot = function (attribute) {
      // console.log(attribute);
      document.getElementById("output").innerHTML = display_text[attribute]
      // document.getElementById("output").innerHTML = names[attribute]+"\n"
      max = 0
      min = 10000000
      for (const [key, value] of data) {
        v = parseFloat(value[attribute]);
        if (v < min) {
          min = v
        }
        if (v > max) {
          max = v
        }
      }
      const colorScale = d3.scaleLinear()
        .domain([min, max])
        .range(["purple", "orange"]);
      const colorScaleReverse = d3.scaleLinear()
        .domain([min, max])
        .range(["orange", "purple"]);

      //const colorOrd = d3.scaleOrdinal(d3.schemeSet1);
      const colorOrd = d3.scaleOrdinal().range(["#E69F00","#56B4E9","#009E73","#F0E442"])


      
      let topo = mapdata[0]

      ledgend.selectAll("*")
        .remove()
        if(polarity[attribute]==1){
          ledgend.append(() => Legend(colorScale, { title: display_names[attribute] + " "+percentage[attribute], width: width - 20 }))
        .attr("transform", "translate(10,0)")
      }
      if(polarity[attribute]==0){
          ledgend.append(() => Legend(colorScaleReverse, { title: display_names[attribute] + " "+percentage[attribute], width: width - 20 }))
        .attr("transform", "translate(10,0)")
      }
      if(polarity[attribute] == 2 ){
        document.getElementById("year").style.visibility = "hidden"; 
      }else{
        document.getElementById("year").style.visibility = "visible"; 
      }
      
    //   if(polarity[attribute]==2){
    //       ledgend.append("text")
    //       .attr("x", 10 )
    // .attr("y", 20)
    // .attr("dy", ".35em")
    //       .text("C1 = Least Inclusive")
    //       .attr("color","red")
    //     .attr("transform", "translate(10,0)")
    //     ledgend.append("text")
    //       .attr("x", 120 )
    // .attr("y", 20)
    // .attr("dy", ".35em")
    //       .text("C2 = More Inclusive Cluster (around national averages)")
    //     .attr("transform", "translate(10,0)")
    //   }




      mapspace.selectAll("*")
        .remove()
      mapspace.selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("stroke", "black")
        .attr("stroke-width", 0.1)
        .attr("fill", function (d) {
        //  d.total = data.get(d.properties.LAD13CD + year) || 0;
          d.total = data.get(d.properties.LAD21CD + year) || 0;
          // console.log(d.total[25]+" " + year +" "+d.total[attribute])
          if(polarity[attribute]==1){
            return colorScale(d.total[attribute]);
          }
          if(polarity[attribute]==0){
            console.log("polarity[attribute]");
            return colorScaleReverse(d.total[attribute])
          }
          if(polarity[attribute]==2){
            return colorOrd(d.total[attribute])
          }
        })
        .on("mouseover", function (d) {
          d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 0.7);
        })
        .on("mouseleave", function (d) {
          d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1);
        })
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .append("title").text(function (d) {
          return d.total[25] + " \n"  + d.total[attribute];
        })

    }