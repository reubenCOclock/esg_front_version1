import axios from "axios";

const ScoreReliability = async (userId) => {
  const getTotalDataPointsWeight = await axios.get(
    "http://localhost:3000/totalDataPointsWeight"
  );

  //console.log(getTotalDataPointsWeight.data);

  const getDataWeightsByCriteria = await axios.get(
    "http://localhost:3000/totalDataPointsWeightByCriteria"
  );

  //console.log("here are the data criteria");
  //console.log(getDataWeightsByCriteria.data.length);
  //console.log(getDataWeightsByCriteria.data);

  const getDataWeightsByAnsweredQuestions = async (dataWeightsArray, total) => {
    //console.log("here is the total information");
    //console.log(total.data[0].sum);
    let progression = 0;
    for (let i = 0; i < dataWeightsArray.data.length; i++) {
      //console.log("here is the data weight");
      //console.log(dataWeightsArray.data[i]);
      const getQuestionWeightByCriteria = await axios.get(
        "http://localhost:3000/dataPointWeightByQC/" +
          dataWeightsArray.data[i].ethical_code +
          "/" +
          userId
      );
      if (getQuestionWeightByCriteria.data.length > 0) {
        //console.log("there is available data");

        const criteriaWeight =
          dataWeightsArray.data[i].total / total.data[0].sum;

        //console.log("here is the criteria weight");
        //console.log(criteriaWeight);

        let reliability =
          getQuestionWeightByCriteria.data[0].sum /
          dataWeightsArray.data[i].total;

        //console.log("here is the reliability");
        //console.log(reliability);

        let weightedReliability = reliability * criteriaWeight;
        let weightedReliabilityToFixed = parseFloat(
          (weightedReliability * 100).toFixed()
        );

        //console.log("here is the weighedReliability");
        //console.log(weightedReliability);

        progression += weightedReliabilityToFixed;
      }
    }
    // console.log("here is the progression");
    //console.log(progression);
    return progression;
  };

  const reliability = await getDataWeightsByAnsweredQuestions(
    getDataWeightsByCriteria,
    getTotalDataPointsWeight
  );

  return reliability;
};

export default ScoreReliability;
