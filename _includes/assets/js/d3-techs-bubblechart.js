(function () {
  var shouldRun = false;
  var data = null;

  var techStackSvg = document.getElementById('teck-stack-svg');
  if (techStackSvg !== null) {
    techStackSvg.addEventListener('lazyload', function () {
      shouldRun = true;
      if (data) initD3TechStackBubbleWithData(data);
    });

    window.addEventListener('load', function() {
      d3.json("https://bunkersem.github.io/portfolio/technologies.json", function (d) {
        data = d;
        window.doNotCarbageCollectThis = new Array(data.length);
        for(let i = 0; i < data.length; i++) {
          var item = data[i];
          var img = window.doNotCarbageCollectThis[i] = new Image();
          img.src = "https://bunkersem.github.io/portfolio/images/techs/" + item.icon;
        }
        initD3TechStackBubbleWithData(data);
      });
    });
  }

  function initD3TechStackBubbleWithData(data) {
    if (!shouldRun) return;
    shouldRun = false;
    if (document.getElementById("teck-stack-svg") === null) return;
    var svg = d3.select("#teck-stack-svg");
    var width = svg.property("clientWidth"); // get width in pixels

    var height = +svg.attr("height");
    var centerX = width * 0.5;
    var centerY = height * 0.5;
    var strength = 0.05;
    var focusedNode;
    console.log("width", width);
    var format = d3.format(",d");
    var scaleColor = d3.scaleOrdinal(d3.schemeCategory20); // use pack to calculate radius of the circle

    var pack = d3
      .pack()
      .size([width, height])
      .padding(1.5);
    var forceCollide = d3.forceCollide(function (d) {
      return d.r + 1;
    }); // use the force

    var simulation = d3
      .forceSimulation() // .force('link', d3.forceLink().id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("collide", forceCollide) // .force('center', d3.forceCenter(centerX, centerY))
      .force("x", d3.forceX(centerX).strength(strength))
      .force("y", d3.forceY(centerY).strength(strength)); // reduce number of circles on mobile screen due to slow computation

    if (
      "matchMedia" in window &&
      window.matchMedia("(max-device-width: 767px)").matches
    ) {
      data = data.filter(function (el) {
        return el.value >= 50;
      });
    } // match image directory

    data.forEach(function (item) {
      item.icon = "https://bunkersem.github.io/portfolio/images/techs/" + item.icon;
    });
    var root = d3
      .hierarchy({
        children: data
      })
      .sum(function (d) {
        return d.value;
      }); // we use pack() to automatically calculate radius conveniently only
    // and get only the leaves

    var nodes = pack(root)
      .leaves()
      .map(function (node) {
        // console.log('node:', node.x, (node.x - centerX) * 2);
        var data = node.data;
        return {
          x: centerX + (node.x - centerX) * 3,
          // magnify start position to have transition to center movement
          y: centerY + (node.y - centerY) * 3,
          r: 0,
          // for tweening
          radius: node.r,
          //original radius
          id: data.cat + "." + data.name.replace(/\s/g, "-"),
          cat: data.cat,
          name: data.name,
          value: data.value,
          icon: data.icon,
          desc: data.desc
        };
      });
    simulation.nodes(nodes).on("tick", ticked);
    svg.style("background-color", "#eee");
    var node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", function (d) {
            if (!d3.event.active) {
              simulation.alphaTarget(0.2).restart();
            }

            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", function (d) {
            if (!d3.event.active) {
              simulation.alphaTarget(0);
            }

            d.fx = null;
            d.fy = null;
          })
      );
    node
      .append("circle")
      .attr("id", function (d) {
        return d.id;
      })
      .attr("r", 0)
      .style("fill", function (d) {
        return scaleColor(d.cat);
      })
      .transition()
      .duration(2000)
      .ease(d3.easeElasticOut)
      .tween("circleIn", function (d) {
        var i = d3.interpolateNumber(0, d.radius);
        return function (t) {
          d.r = i(t);
          simulation.force("collide", forceCollide);
        };
      });
    node
      .append("clipPath")
      .attr("id", function (d) {
        return "clip-".concat(d.id);
      })
      .append("use")
      .attr("xlink:href", function (d) {
        return "#".concat(d.id);
      }); // display text as circle icon

    node
      .filter(function (d) {
        return !d.icon;
      })
      .append("text")
      .classed("node-icon", true)
      .attr("clip-path", function (d) {
        return "url(#clip-".concat(d.id, ")");
      })
      .selectAll("tspan")
      .data(function (d) {
        return d.icon.split(";");
      })
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("y", function (d, i, nodes) {
        return 13 + (i - nodes.length / 2 - 0.5) * 10;
      })
      .text(function (name) {
        return name;
      }); // display image as circle icon

    node
      .filter(function (d) {
        return d.icon;
      })
      .append("image")
      .classed("node-icon", true)
      .attr("clip-path", function (d) {
        return "url(#clip-".concat(d.id, ")");
      })
      .attr("xlink:href", function (d) {
        return d.icon;
      })
      .attr("x", function (d) {
        return -d.radius * 0.7;
      })
      .attr("y", function (d) {
        return -d.radius * 0.7;
      })
      .attr("height", function (d) {
        return d.radius * 2 * 0.7;
      })
      .attr("width", function (d) {
        return d.radius * 2 * 0.7;
      });
    node.append("title").text(function (d) {
      return d.desc;
    });
    var legendOrdinal = d3
      .legendColor()
      .scale(scaleColor)
      .shape("circle"); // legend 1

    svg
      .append("g")
      .classed("legend-color", true)
      .attr("text-anchor", "start")
      .attr("transform", "translate(20,30)")
      .style("font-size", "12px")
      .call(legendOrdinal);
    var sizeScale = d3
      .scaleOrdinal()
      .domain(["less skilled", "more skilled"])
      .range([5, 10]);
    var legendSize = d3
      .legendSize()
      .scale(sizeScale)
      .shape("circle")
      .shapePadding(10)
      .labelAlign("end"); // legend 2

    svg
      .append("g")
      .classed("legend-size", true)
      .attr("text-anchor", "start")
      .attr("transform", "translate(150, 25)")
      .style("font-size", "12px")
      .call(legendSize);

    var infoBox = node
      .append("foreignObject")
      .classed("circle-overlay hidden", true)
      .attr("x", -350 * 0.5 * 0.8)
      .attr("y", 0)
      .attr("height", 350 * 0.8)
      .attr("width", 350 * 0.8)
      .append("xhtml:div")
      .classed("circle-overlay__inner", true);
    infoBox
      .append("h2")
      .classed("circle-overlay__title", true)
      .text(function (d) {
        return d.name;
      });
    infoBox
      .append("p")
      .classed("circle-overlay__body", true)
      .html(function (d) {
        return d.desc;
      });
    node.on("click", function (currentNode) {
      d3.event.stopPropagation();
      console.log("currentNode", currentNode);
      var currentTarget = d3.event.currentTarget; // the <g> el

      if (currentNode === focusedNode) {
        // no focusedNode or same focused node is clicked
        return;
      }

      var lastNode = focusedNode;
      focusedNode = currentNode;
      simulation.alphaTarget(0.2).restart(); // hide all circle-overlay

      d3.selectAll(".circle-overlay").classed("hidden", true);
      d3.selectAll(".node-icon").classed("node-icon--faded", false); // don't fix last node to center anymore
      d3.selectAll(".node").classed('open-start', false);

      if (lastNode) {
        lastNode.fx = null;
        lastNode.fy = null;
        node
          .filter(function (d, i) {
            return i === lastNode.index;
          })
          .transition()
          .duration(2000)
          .ease(d3.easePolyOut)
          .tween("circleOut", function () {
            var irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
            return function (t) {
              lastNode.r = irl(t);
            };
          })
          .on("interrupt", function () {
            lastNode.r = lastNode.radius;
          });
      } // if (!d3.event.active) simulation.alphaTarget(0.5).restart();

      d3.transition()
        .duration(2000)
        .ease(d3.easePolyOut)
        .tween("moveIn", function () {
          console.log("tweenMoveIn", currentNode);
          var ix = d3.interpolateNumber(currentNode.x, centerX);
          var iy = d3.interpolateNumber(currentNode.y, centerY);
          var ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
          return function (t) {
            // console.log('i', ix(t), iy(t));
            currentNode.fx = ix(t);
            currentNode.fy = iy(t);
            currentNode.r = ir(t);
            simulation.force("collide", forceCollide);
          };
        })
        .on("start", function () {
          var $currentGroup = d3.select(currentTarget);
          $currentGroup.classed('open-start', true);
        })
        .on("end", function () {
          simulation.alphaTarget(0);
          var $currentGroup = d3.select(currentTarget);
          $currentGroup.select(".circle-overlay").classed("hidden", false);
          $currentGroup.select(".node-icon").classed("node-icon--faded", true);
        })
        .on("interrupt", function () {
          console.log("move interrupt", currentNode);
          currentNode.fx = null;
          currentNode.fy = null;
          simulation.alphaTarget(0);
        });
    }); // blur

    d3.select(document).on("click", function () {
      var target = d3.event.target; // check if click on document but not on the circle overlay

      if (!target.closest("#circle-overlay") && focusedNode) {
        focusedNode.fx = null;
        focusedNode.fy = null;
        simulation.alphaTarget(0.2).restart();
        d3.transition()
          .duration(2000)
          .ease(d3.easePolyOut)
          .tween("moveOut", function () {
            console.log("tweenMoveOut", focusedNode);
            var ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
            return function (t) {
              focusedNode.r = ir(t);
              simulation.force("collide", forceCollide);
            };
          })
          .on("end", function () {
            focusedNode = null;
            simulation.alphaTarget(0);
          })
          .on("interrupt", function () {
            simulation.alphaTarget(0);
          }); // hide all circle-overlay

        d3.selectAll(".circle-overlay").classed("hidden", true);
        d3.selectAll(".node-icon").classed("node-icon--faded", false);
        d3.selectAll(".node").classed('open-start', false);
      }
    });

    function ticked() {
      node
        .attr("transform", function (d) {
          return "translate(".concat(d.x, ",").concat(d.y, ")");
        })
        .select("circle")
        .attr("r", function (d) {
          return d.r;
        });
    }
  };

})();
