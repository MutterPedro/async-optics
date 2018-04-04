socket.on('packageInfo', data => {
  // console.log('packageInfo', data);
	let sunData = data;
  for(let i = 0; i < sunData.children.length; i++){
    rootTime += sunData.children[i].totalTime
  }
    root = d3.hierarchy(sunData);
    root.sum(function(d) { return d.duration; });
    svg_sun.selectAll("path")
           .data(partition(root).descendants())
           .enter().append("path")
           .attr("d", arc)
           .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
           .on("click", click)
           .append("title")
           .text(function(d) { return d.data.name === 'root' ? `${d.data.name} \n ${formatNumber_sun(rootTime)}` : `${d.data.name} \n ${formatNumber_sun(d.data.totalTime)}` });

  var packageData = d3.select("#package-panel")
      .selectAll("#packageData")
      .data(sunData.children)
      .enter()
      .append("div")
      .attr("class", "package-info")
      .style("background-color", function(d){
        return color((d.children ? d : d.parent).name);
      })

    packageData.append("h4").attr("class", "package-name")
               .text((d) => { return `${d.name}`})
    packageData.append("p").attr("class", "package-data")
               .text((d) => { return `percentage: ${Math.floor(d.totalTime/rootTime * 100)}%`})
    packageData.append("p").attr("class", "package-data")
               .text((d) => { return `time taken to load: ${d.totalTime} ms`})
});


let rootTime = 0;

const sunWidth = 960;
const sunHeight = 700;
const radius = (Math.min(sunWidth, sunHeight) / 2) - 10;

const formatNumber_sun = d3.format(",d");

let x = d3.scaleLinear()
            .range([0, 2 * Math.PI]);

let y = d3.scaleSqrt()
            .range([0, radius]);

const color = d3.scaleOrdinal(["#ffd644", "#6cfff9", "#30ff2c", "#ee74ff", "#ccff43", "#ff7d63"]);
// console.log('colorss', d3.schemeCategory20c)

const partition = d3.partition();

const arc = d3.arc()
              .startAngle( (d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
              .endAngle( (d) => { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
              .innerRadius( (d) => { return Math.max(0, y(d.y0)); })
              .outerRadius( (d) => { return Math.max(0, y(d.y1)); });


const svg_sun = d3.select("#sunburst-container")
            .append("svg")
            .attr("id", "sun-container")
            .attr("width", sunWidth)
            .attr("height", sunHeight)
            .append("g")
            .attr("transform", "translate(" + sunWidth / 2 + "," + (sunHeight / 2) + ")");

function click(d) {
  svg_sun.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });

  d3.select("#package-panel").selectAll("*").remove()
    packageData
    var parent = [d.data]
    var packageData = d3.select("#package-panel")
      .selectAll("#packageData")
      .data(d.children)
      .enter()
      .append("div")
      .attr("class", "package-info")
      .style("border-color", function(d){
        return color((d.children ? d : d.parent).data.name);
      })


    packageData.append("h4").attr("class", "package-name")
               .text((c) => { return `${c.data.name}`})
    packageData.append("p").attr("class", "package-data")
               .text((c) => {
                  return `percentage: ${parent[0].name === 'root' ?
                  Math.floor(c.data.totalTime/rootTime * 100)
                  :
                  Math.floor(c.data.totalTime/parent[0].totalTime * 100)}%`
              })
    packageData.append("p").attr("class", "package-data")
               .text((c) => { return `time taken to load: ${c.data.totalTime} ms`})


    var parentPanel = d3.select("#package-panel")
                        .selectAll("#packageData")
                        .data(parent)
                        .enter()
                        .insert("div", ":first-child")
                        .attr("class", "package-info")
                        .style("border-color", function(d){
                          return color((d.children ? d : d).name);
                        })
    parentPanel.insert("h4", ".package-info").attr("class", "parent-name")
               .text(() => {
                  return `Currently inspecting: ${parent[0].name}`
               })
    parentPanel.insert("p", ".package-info").attr("class", "parent-data")
               .text(() => {
                  return `time taken to load: ${parent[0].name === 'root' ? rootTime : parent[0].totalTime} ms`
               })
}

d3.select(self.frameElement).style("height", sunHeight + "px");
