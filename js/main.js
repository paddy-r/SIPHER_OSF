

    
    var names = ["EmpRate","QualProportion","LTsick","digital","MaxMinRatio","Access","ratio_80_20","AffRatio","child_poverty","food","Decent","Turnout","PermEmp","tdr","sr","le_both","le_var_abs_both","le_var_rel_both","le_male","le_var_abs_male","le_var_rel_male","le_female","le_var_abs_female","le_var_rel_female","Cluster"]


    var display_names = ["1A: Participation in paid employment (percentage of people aged 16-64 in employment)",
    "1B: Skills and qualifications (percentage of people aged 16-29 with Level 2 or higher NVQ qualification)",
    "2A: Involuntary exclusion from the labour market (proportion of people aged 16-64 on long-term sick)",
    "2B: Digital connectivity (proportion of people digitally withdrawn or passive/uncommitted internet users)",
    "3A: Wealth inequality (ratio of max. to min. house sale prices by ward)",
    "3B: Physical connectivity (access to public transport)",
    "4A: Earnings inequality (ratio of 80th to 20th percentiles of full-time earnings)",
    "4B: Housing affordability (ratio of house prices to earnings)",
    "5A: Poverty (percentage of children in low-income households)",
    "5B: Cost of living (percentage of households experiencing food insecurity)",
    "6A: Decent pay (proportion of employee jobs paid below Living Wage)",
    "6B: Inclusion in decision-making (turnout at local elections)",
    "7A: Job security (percentage of employees aged 16+ permanently employed)",
    "Total dependency ratio, WHO definition (N(0-14y) + N(65+y)) / N(15-64y)",
    "Sex ratio (males/females)",
    "Life expectancy at birth (in years, both sexes)",
    "Lifespan variation at birth (e-dagger in years, both sexes)",
    "Lifespan variation at birth (Keyfitz’ entropy, both sexes)",
    "Life expectancy at birth (in years, males)",
    "Lifespan variation at birth (e-dagger in years, males)",
    "Lifespan variation at birth (Keyfitz’ entropy, males)",
    "Life expectancy at birth (in years, females)",
    "Lifespan variation at birth (e-dagger in years, females)",
    "Lifespan variation at birth (Keyfitz’ entropy, females)",
    "Four-cluster k-means solution (2020)"]

    var display_text = ["Percentage of individuals aged 16-64 who are employed",
      "Percentage of adults aged 16-49 with a Level 2 or higher NVQ qualification",
      "Percentage of individuals aged 16-64 on long-term sick",
      "Percentage of sub-areas within local authorities characterised by withdrawn or passive/uncommitted internet users or settled offline communities",
      "Ratio of maximum to minimum house sale prices per ward within each local authority",
      "Percentage of sub-areas with local authorities with good access to public transport",
      "Ratio of 80th to 20th percentiles of weekly earnings (residents in FT work)",
      "Ratio of house prices to earnings within each local authority",
      "Percentage of children living in low-income households",
      "Percentage of households experiencing food insecurity",
      "Percentage of employee jobs that are not paid at or above the Living Wage, as defined by the Living Wage Foundation",
      "Percentage of eligible voters participating in local elections",
      "Percentage of employees aged 16-64 who are permanently employed",
      "Ratio of the number of dependents aged zero to 14 and over 65, compared with the total population aged 15 to 64",
      "Ratio of the number of males to number of females",
      "LE at birth in years for both sexes combined",
      "LV at birth in years – “e_dagger” – for both sexes combined",
      "LV at birth, dimensionless – “Keyfitz Entropy” – for both sexes combined",
      "LE at birth in years for males",
      "LV at birth in years – “e_dagger” – for males",
      "LV at birth, dimensionless – “Keyfitz Entropy” – for males",
      "LE at birth in years for females",
      "LV at birth in years – “e_dagger” – for females",
      "LV at birth, dimensionless – “Keyfitz Entropy” – for both females",
      "Four-cluster k-means solution (2020) \n (1) Less inclusive \n (2) More inclusive \n (3) Average \n (4) Mix of extremes"]



    var polarity =[1,1,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,2]
    var percentage = ["(%)","(%)","(%)","(%)","","(%)",0,0,"(%)","(%)","(%)","(%)","(%)","(%)","","","","","","","","","","",""]

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
        projection .translate([width / 1.4, height / 2])
        console.log(width);
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