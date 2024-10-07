import { useEffect } from "react";

const TradingViewWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        width: "100%",
        height: 450,
        symbol: "BITSTAMP:EURUSD",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#EF4444",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        show_popup_button: true,
        details: true,
        popup_width: "1000",
        popup_height: "650",
        container_id: "tradingview_0b60e",
      });
    };

    document.getElementById("tradingview-script-container").appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="tradingview-widget-container w-full max-w-4xl bg-secondary-800/20 rounded-3xl shadow-2xl p-4">
        <div
          id="tradingview_0b60e"
          className="rounded-3xl overflow-hidden"
        ></div>
        <div id="tradingview-script-container"></div>
      </div>
    </div>
  );
};

export default TradingViewWidget;
