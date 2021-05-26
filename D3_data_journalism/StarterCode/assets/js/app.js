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
var svg = d3.select("#scatter")
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
        .domain([35000, d3.max(readData, d => d.income)])
        .range([0, width])
    
    //y
    var yLinearScale = d3.scaleLinear()
        .domain([15, d3.max(readData, d => d.obesity)])
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
        .attr("r", "10")
        .attr("fill", "red")
        .attr("opacity", ".25");

    //create labels for each state using ABBR
    svg.selectAll("text")
        .data(readData)
        .enter()
        .append("text")
        .attr("x", d => d.income)
        .attr("y", d => d.obesity)
        .text(d => d.abbr)
        .attr("font-size", "10px")
        .attr("fill", "black")

    //create tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function(d) {
            return (`${d.state} <br> Median Income: ${d.income} <br> Obesity Rate: ${d.obesity}`)

        });

    //add tooltip to chart
    chartGroup.call(toolTip);

    //allow user to hide/show tool tip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data)
    });



    //create labels for axes
    //y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("State Obesity Rate")

    //x axis
    chartGroup.append("text")
        .attr('transform', `translate(${width/2}, ${height +margin.top + 30})`)
        .attr("class", "axisText")
        .text("State Median Income in Dollars")


    
    

}).catch(function(error) {
    console.log(error)
})