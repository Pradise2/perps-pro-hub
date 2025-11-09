import { useState, useMemo } from "react";
import { useTradingContext } from "@/contexts/TradingContext";
import { TradingService } from "@/services/TradingService";
import { OrderRequest } from "@/types/trading";

export const useOrderPlacement = () => {
  const { state, actions } = useTradingContext();
  const [leverage, setLeverage] = useState([10]);
  const [collateral, setCollateral] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderErrors, setOrderErrors] = useState<string[]>([]);

  const selectedMarket = state.selectedMarket;
  const availableBalance = parseFloat(state.balance.available.replace(/,/g, '')) || 0;

  const positionDetails = useMemo(() => {
    const collateralNum = parseFloat(collateral) || 0;
    const leverageNum = leverage[0];
    const currentPrice = parseFloat(selectedMarket?.price.replace(/,/g, '') || '0');
    
    if (!collateralNum || !currentPrice) {
      return {
        positionSize: 0,
        liquidationPrice: 0,
        tradingFee: 0
      };
    }

    const positionSize = collateralNum * leverageNum;
    const liquidationPrice = TradingService.calculateLiquidationPrice(
      currentPrice,
      leverageNum,
      "long" // For display purposes, can toggle based on selected side
    );
    const tradingFee = TradingService.calculateTradingFee(positionSize);

    return {
      positionSize,
      liquidationPrice,
      tradingFee
    };
  }, [collateral, leverage, selectedMarket]);
