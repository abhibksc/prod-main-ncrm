import { useEffect } from "react";

const TradingViewWidget = () => (
  <div className="flex justify-center items-center">
    <div className="tradingview-widget-container w-full max-w-4xl bg-secondary-800/20 rounded-3xl shadow-2xl overflow-hidden p-0 md:p-4">
      <iframe
        src="https://fxpricing.com/fx-widget/market-currency-rates-widget.php?id=1,2,3,5,14,20&theme=dark"
        width="100%"
        height="335"
        frameBorder="0"
        className="rounded-2xl w-full"
      />
    </div>
  </div>
);

export default TradingViewWidget;
