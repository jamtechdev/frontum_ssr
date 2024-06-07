import React from "react";

import CompareDiv from "@/components/Common/ComparisanComponent/CompareDiv";

function Comparison({
  slug,
  categorySlug,
  comparisonData,
  categroyAttributes,
  graphComparisonProsCons,
  getComparisonPhase,
  getProsConsforVsPage
}) {
  return (
    <>
   
      <CompareDiv
        slug={slug}
        categorySlug={categorySlug}
        comparisonData={comparisonData}
        categroyAttributes={categroyAttributes?.data}
        graphComparisonProsCons={graphComparisonProsCons?.data}
        getComparisonPhase={getComparisonPhase?.data}
        getProsConsforVsPage={getProsConsforVsPage}
      />
      
    </>
  );
}

export default Comparison;
