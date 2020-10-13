import React, { useState, useEffect } from "react";

import axios from "axios";

import { PieChart } from "react-minimal-pie-chart";
import DonutChart from "react-svg-donut";
import "../../styles/components/bar_chart.scss";

const BarChart = (props) => {
  return (
    <div class="container-bar-chart">
      <div class="justify-content-center">
        <div class="flex-bar-chart-center">
          {props.categories.map((elementArray) => {
            return elementArray.categoryArray.map((element) => {
              const proportion =
                (element.categoryProportion / props.sum).toFixed(2) * 100;
              return (
                <>
                  <div class="flex-bar-chart-items">
                    <div class="title-holder">
                      <div class="bar-chart-title"> {element.category}</div>
                    </div>
                    <div
                      style={{
                        width: proportion + "%",
                      }}
                      class="bar"
                    >
                      {" "}
                    </div>
                    <div class="text-center bar-text">
                      {" "}
                      {proportion.toFixed(2)} %
                    </div>
                  </div>
                </>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
