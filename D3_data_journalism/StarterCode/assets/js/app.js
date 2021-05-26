// @TODO: YOUR CODE HERE!
//variables that will create size of SVG
var svgWidth = 960;
var svgHeight = 500;

//create margin object
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//creates svg object at the id "scatter"
var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

//transforms margins to svg (inverse)
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//create promise function to read data
d3.csv("assets/data/data.csv").then(function(readData){
    //parse through data
    readData.forEach(data => {
        data.income = +data.income;
        data.obesity = +data.obesity;

    });

    //find max x and y for scale
    // x
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(readData, d => d.income)])
        .range([0, width])
    
    //y
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(readData, d => d.obesity)])
        .range([height, 0])

    //create axes based on newly created variables
    var botAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    //add axes to chart
    chartGroup.append("g")
        .attr("transform",  `translate(0, ${height})`)
        .call(botAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create scatter plot points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(readData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".25");

    //create tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state} <br> Median Income: ${d.income} <br> Obesity Rate: ${d.obesity}`)

        });

    //add tooltip to chart

})