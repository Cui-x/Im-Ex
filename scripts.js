// a function to convert all the numbers into numbers
function types(d){
  // loop through all the years in the data
  for (var i = 1996;i<2016;i++){
    var name = 'y'+i+'to'+(i+1);
    d[name] = +(d[name]);
  }
  return d;
}

$(document).ready(function(){

  // define margins and whatnot
  var margin = {top: 0, right: 2, bottom: 30, left: 0},
      width = 780 - margin.left - margin.right,
      height = 390 - margin.top - margin.bottom;

  // time formatter
  var parseTime = d3.timeParse("%d-%b-%y");

  // x scale
  var x = d3.scaleTime()
      .range([0,width]);

  // y scale
  var y = d3.scaleLinear()
      .range([height,0]);

  // x axis
  var xAxis = d3.axisBottom().scale(x).tickSizeInner(-height).tickSizeOuter(0).tickPadding(8);

  // y axis
  var yAxis = d3.axisRight().scale(y).tickSizeInner(-width).tickSizeOuter(0).tickPadding(8);

  // line for exports
  var lineExport = d3.line()
    .x(function(d){ return x(d.date); })
    .y(function(d){ return y(d.export); });

  // line for imports
  var lineImport = d3.line()
    .x(function(d){ return x(d.date); })
    .y(function(d){ return y(d.import); });

  // areas
  var areaAboveExport = d3.area()
    .x(lineExport.x())
    .y0(lineExport.y())
    .y1(0);

  var areaBelowExport = d3.area()
    .x(lineExport.x())
    .y0(lineExport.y())
    .y1(height);

  var areaAboveImport = d3.area()
    .x(lineImport.x())
    .y0(lineImport.y())
    .y1(0);

  var areaBelowImport = d3.area()
    .x(lineImport.x())
    .y0(lineImport.y())
    .y1(height);


  // create an svg element, append it to the .chart div, and append a g to it
  var svg = d3.select('.chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

  d3.tsv('total_real.tsv', type, function(error,data){
    if (error) throw error;

    //extent of the x domain
    //the really enormous numbers are to add padding
    x.domain([(d3.min(data, function(d){ return d.date-8000000000; })),(d3.max(data, function(d){ return d.date-(-86890000000); }))]);

    // y domain. setting the max to export now, and adding some padding
    y.domain([0,(d3.max(data, function(d){ return d.import+d.import*.2; }))]);

    // append x axis to the svg element
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height +')')
        .call(xAxis)
      .append('text')
        .attr('class','x axis label')
        .attr('x',width-margin.right)
        .attr('y',15)
        .style('text-anchor','end')
        .text('Years');

    // set the first year of the x axis a little to the left
    $('.x.axis g.tick:first-of-type text').attr('x',8.5);

    // append y axis to the svg element
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform','translate(' + width + ',0)')
        .call(yAxis)
      .append('text')
        .attr('x', -34)
        .attr('y', 6)
        .attr('dy', '.71em')
        .attr('class', 'y axis label')
        .style('text-anchor', 'end')
        .text('100 million of dollars');

    var bottomY = $('.y.axis .tick:first-of-type text').text();
    $('.y.axis .tick:first-of-type text').html(bottomY+' &#8377;')

    // y axis ticks placement
    $('.y.axis .tick text').attr('x',-60).attr('y',-6);

    // append a path, or a line, to the svg element, for Imports
    svg.append('defs').append('path')
        .datum(data)
        .attr('id', 'lineimports')
        .attr('class', 'line imports')
        .attr('transform','translate(0,-2)')
        .attr('d', lineImport);

    svg.append('text')
        .attr('class','line-text')
        .attr('id','imports-text')
        .attr('transform','translate(0,-5)')
        .attr('word-spacing',25)
      .append('textPath')
        .attr('xlink:href','#lineimports')
        .html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Imports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Line Representing Imports into China')

    svg.append('use')
        .attr('id', 'exports-line')
        .attr('xlink:href', '#lineimports');

    // append a line that's the same as imports, but just a single line
    svg.append('path')
        .datum(data)
        .attr('class', 'line-thin')
        .attr('d', lineImport);

    // append a path, or a line, to the svg element, for EXPORTS
    svg.append('defs').append('path')
        .datum(data)
        .attr('id', 'lineexports')
        .attr('class', 'line exports')
        .attr('transform','translate(0,2)')
        .attr('d', lineExport);

    svg.append('text')
        .attr('class','line-text')
        .attr('id','exports-text')
        .attr('transform','translate(0,12)')
        .attr('word-spacing',50)
      .append('textPath')
        .attr('xlink:href','#lineexports')
        .html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Line Representing Exports');

    svg.append('use')
        .attr('id', 'exports-line')
        .attr('xlink:href', '#lineexports');

    // append a line that's the same as exports, but just a single line
    svg.append('path')
        .datum(data)
        .attr('class', 'line-thin')
        .attr('d', lineExport);

    // define areas
    var defs = svg.append('defs');

    defs.append('clipPath')
        .attr('id','clip-import')
      .append('path')
        .datum(data)
        .attr('d',areaAboveImport);

    defs.append('clipPath')
        .attr('id','clip-export')
      .append('path')
        .datum(data)
        .attr('d',areaAboveExport);

    // IMPORT IS ABOVE EXPORT
    svg.append('path')
        .datum(data)
        .attr('d', areaBelowImport)
        .attr('class','surplus import')
        .attr('clip-path', 'url(#clip-export)')

    svg.append('text')
        .attr('class','line-text')
        .attr('id','area-text')
        .attr('transform','translate(0,30)')
        .attr('word-spacing',25)
      .append('textPath')
        .attr('xlink:href','#lineimports')
        .html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')


    // EXPORT IS ABOVE IMPORT
    svg.append('path')
        .datum(data)
        .attr('class','surplus export')
        .attr('d', areaBelowExport)
        .attr('clip-path', 'url(#clip-import)');

    // place the shaded area below the axis lines
    $('svg g:first-of-type').before($('.import.surplus')).before($('.export.surplus'));
  });// end tsv

  // set the data types
  function type(d) {
    d.date = parseTime(d.date);
    d.export = +d.export;
    d.import = +d.import;
    return d;
  }

});// end document ready
