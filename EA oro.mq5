//+------------------------------------------------------------------+
//|                                           PendingOrdersEA.mq5 |
//|                                          Copyright 2025       |
//|                                                               |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025"
#property link      ""
#property version   "1.00"
#property strict

// Inputs del EA
input double LotSize = 0.01;     // Tamaño del lote
input int PendingDistance = 35;  // Distancia para órdenes pendientes (en puntos)
input int StopLoss = 15;         // Stop Loss (en pips)
input double TakeProfit = 0.20;   // Beneficio flotante para cerrar (en dólares)

// Variables globales
int buyTicket = 0;     // Ticket de la orden buy stop
int sellTicket = 0;    // Ticket de la orden sell stop
bool cycleActive = false;  // Estado del ciclo

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   // Asegurarse de que el EA funcionará con 5 dígitos y 3 dígitos
   StartNewCycle();
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   // Limpieza al detener el EA
   DeleteAllPendingOrders();
   Print("EA detenido, se han eliminado todas las órdenes pendientes");
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   // Verificar el beneficio flotante total
   if(GetTotalFloatingProfit() >= TakeProfit)
   {
      Print("¡Beneficio flotante alcanzado! Cerrando operaciones y reiniciando ciclo.");
      CloseAllPositions();
      DeleteAllPendingOrders();
      StartNewCycle();
      return;
   }
   
   // Verificar si necesitamos comenzar un nuevo ciclo
   if(!cycleActive)
   {
      StartNewCycle();
      return;
   }
   
   // Verificar el estado de las órdenes pendientes
   if(!OrderExists(buyTicket) && !OrderExists(sellTicket))
   {
      // Si no hay órdenes pendientes activas, verificar si hay posiciones abiertas
      if(PositionsTotal() == 0)
      {
         // No hay órdenes pendientes ni posiciones abiertas, iniciar nuevo ciclo
         StartNewCycle();
      }
   }
   
   // Verificar que solo existan las dos órdenes pendientes específicas
   EnsureOnlyTwoPendingOrders();
}

//+------------------------------------------------------------------+
//| Función para iniciar un nuevo ciclo                              |
//+------------------------------------------------------------------+
void StartNewCycle()
{
   // Eliminar cualquier orden pendiente existente para asegurar que solo haya una de cada tipo
   DeleteAllPendingOrders();
   
   // Obtener el precio actual
   double currentPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   
   // Calcular los precios para las órdenes pendientes
   double buyStopPrice = NormalizeDouble(currentPrice + PendingDistance * _Point, _Digits);
   double sellStopPrice = NormalizeDouble(currentPrice - PendingDistance * _Point, _Digits);
   
   // Calcular los niveles de stop loss
   double buyStopLoss = NormalizeDouble(buyStopPrice - StopLoss * _Point * 10, _Digits); // Multiplicamos por 10 para convertir pips a puntos
   double sellStopLoss = NormalizeDouble(sellStopPrice + StopLoss * _Point * 10, _Digits);
   
   // Colocar órdenes pendientes
   buyTicket = PlacePendingOrder(ORDER_TYPE_BUY_STOP, buyStopPrice, buyStopLoss);
   sellTicket = PlacePendingOrder(ORDER_TYPE_SELL_STOP, sellStopPrice, sellStopLoss);
   
   // Actualizar el estado del ciclo
   cycleActive = (buyTicket > 0 && sellTicket > 0);
   
   Print("Nuevo ciclo iniciado. Buy Stop: ", buyTicket, ", Sell Stop: ", sellTicket);
}

//+------------------------------------------------------------------+
//| Función para colocar órdenes pendientes                          |
//+------------------------------------------------------------------+
int PlacePendingOrder(ENUM_ORDER_TYPE orderType, double price, double stopLoss)
{
   MqlTradeRequest request = {};
   MqlTradeResult result = {};
   
   // Configurar parámetros de la orden
   request.action = TRADE_ACTION_PENDING;
   request.symbol = _Symbol;
   request.volume = LotSize;
   request.type = orderType;
   request.price = price;
   request.sl = stopLoss;
   request.deviation = 10;  // Desviación permitida en puntos
   request.magic = 123456;  // Número mágico para identificar las órdenes de este EA
   
   // Enviar la orden
   if(!OrderSend(request, result))
   {
      Print("Error al colocar la orden pendiente: ", GetLastError());
      return 0;
   }
   
   Print("Orden pendiente colocada: ", result.order, ", Tipo: ", EnumToString(orderType), ", Precio: ", price);
   return result.order;
}

//+------------------------------------------------------------------+
//| Función para verificar si una orden existe                       |
//+------------------------------------------------------------------+
bool OrderExists(int ticket)
{
   if(ticket <= 0) return false;
   
   for(int i = 0; i < OrdersTotal(); i++)
   {
      if(OrderGetTicket(i) == ticket && OrderSelect(OrderGetTicket(i)))
      {
         return true;
      }
   }
   
   return false;
}

//+------------------------------------------------------------------+
//| Función para obtener el beneficio flotante total                 |
//+------------------------------------------------------------------+
double GetTotalFloatingProfit()
{
   double totalProfit = 0;
   
   for(int i = 0; i < PositionsTotal(); i++)
   {
      ulong posTicket = PositionGetTicket(i);
      
      if(PositionSelectByTicket(posTicket))
      {
         // Asegurarse de que la posición pertenece a este símbolo
         if(PositionGetString(POSITION_SYMBOL) == _Symbol)
         {
            totalProfit += PositionGetDouble(POSITION_PROFIT);
         }
      }
   }
   
   return totalProfit;
}

//+------------------------------------------------------------------+
//| Función para cerrar todas las posiciones                         |
//+------------------------------------------------------------------+
void CloseAllPositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong posTicket = PositionGetTicket(i);
      
      if(PositionSelectByTicket(posTicket))
      {
         // Asegurarse de que la posición pertenece a este símbolo
         if(PositionGetString(POSITION_SYMBOL) == _Symbol)
         {
            MqlTradeRequest request = {};
            MqlTradeResult result = {};
            
            request.action = TRADE_ACTION_DEAL;
            request.position = posTicket;
            request.symbol = _Symbol;
            request.volume = PositionGetDouble(POSITION_VOLUME);
            
            if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY)
            {
               request.type = ORDER_TYPE_SELL;
               request.price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
            }
            else
            {
               request.type = ORDER_TYPE_BUY;
               request.price = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
            }
            
            request.deviation = 10;
            
            // Cerrar la posición
            if(!OrderSend(request, result))
            {
               Print("Error al cerrar la posición: ", GetLastError());
            }
            else
            {
               Print("Posición cerrada: ", posTicket);
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Función para eliminar todas las órdenes pendientes               |
//+------------------------------------------------------------------+
void DeleteAllPendingOrders()
{
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      ulong orderTicket = OrderGetTicket(i);
      
      if(OrderSelect(orderTicket))
      {
         if(OrderGetString(ORDER_SYMBOL) == _Symbol)
         {
            MqlTradeRequest request = {};
            MqlTradeResult result = {};
            
            request.action = TRADE_ACTION_REMOVE;
            request.order = orderTicket;
            
            // Eliminar la orden pendiente
            if(!OrderSend(request, result))
            {
               Print("Error al eliminar la orden pendiente: ", GetLastError());
            }
            else
            {
               Print("Orden pendiente eliminada: ", orderTicket);
               
               // Reiniciar las variables globales si corresponde
               if(orderTicket == buyTicket) buyTicket = 0;
               if(orderTicket == sellTicket) sellTicket = 0;
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Función para verificar que solo existan las dos órdenes específicas |
//+------------------------------------------------------------------+
void EnsureOnlyTwoPendingOrders()
{
   // Si ambas órdenes existen, no hay necesidad de verificar
   if(OrderExists(buyTicket) && OrderExists(sellTicket))
      return;
      
   // Primero contar cuántas órdenes pendientes tenemos para este símbolo
   int pendingCount = 0;
   int buyStopCount = 0;
   int sellStopCount = 0;
   bool buyExists = false;
   bool sellExists = false;
   
   for(int i = 0; i < OrdersTotal(); i++)
   {
      ulong orderTicket = OrderGetTicket(i);
      
      if(OrderSelect(orderTicket))
      {
         if(OrderGetString(ORDER_SYMBOL) == _Symbol)
         {
            ENUM_ORDER_TYPE type = (ENUM_ORDER_TYPE)OrderGetInteger(ORDER_TYPE);
            
            // Contar solo órdenes pendientes
            if(type == ORDER_TYPE_BUY_STOP)
            {
               buyStopCount++;
               pendingCount++;
               
               // Verificar si es nuestra orden de buy stop
               if(orderTicket == buyTicket)
                  buyExists = true;
               else
               {
                  // Si encontramos un buy stop que no es nuestro, eliminarlo
                  MqlTradeRequest request = {};
                  MqlTradeResult result = {};
                  
                  request.action = TRADE_ACTION_REMOVE;
                  request.order = orderTicket;
                  
                  if(!OrderSend(request, result))
                  {
                     Print("Error al eliminar orden buy stop extra: ", GetLastError());
                  }
                  else
                  {
                     Print("Orden buy stop extra eliminada: ", orderTicket);
                  }
               }
            }
            else if(type == ORDER_TYPE_SELL_STOP)
            {
               sellStopCount++;
               pendingCount++;
               
               // Verificar si es nuestra orden de sell stop
               if(orderTicket == sellTicket)
                  sellExists = true;
               else
               {
                  // Si encontramos un sell stop que no es nuestro, eliminarlo
                  MqlTradeRequest request = {};
                  MqlTradeResult result = {};
                  
                  request.action = TRADE_ACTION_REMOVE;
                  request.order = orderTicket;
                  
                  if(!OrderSend(request, result))
                  {
                     Print("Error al eliminar orden sell stop extra: ", GetLastError());
                  }
                  else
                  {
                     Print("Orden sell stop extra eliminada: ", orderTicket);
                  }
               }
            }
         }
      }
   }
   
   // Si hay más de un buy stop o un sell stop, reiniciar ciclo
   if(buyStopCount > 1 || sellStopCount > 1)
   {
      Print("Detectados múltiples buy/sell stops. Reiniciando ciclo.");
      DeleteAllPendingOrders();
      cycleActive = false;  // Esto activará un nuevo ciclo en la próxima llamada a OnTick()
   }
   // Si falta alguna de las órdenes pendientes y no hay posiciones abiertas, reiniciar ciclo
   else if((!buyExists || !sellExists) && PositionsTotal() == 0)
   {
      Print("Falta alguna orden pendiente. Reiniciando ciclo.");
      DeleteAllPendingOrders();
      cycleActive = false;
   }
}

//+------------------------------------------------------------------+
//| Función para verificar y gestionar órdenes con stop loss         |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& result)
{
   // Verificar si una posición fue cerrada por stop loss
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong dealTicket = trans.deal;
      
      if(HistoryDealSelect(dealTicket))
      {
         // Verificar si el trato fue una salida (cierre de posición)
         if(HistoryDealGetInteger(dealTicket, DEAL_ENTRY) == DEAL_ENTRY_OUT)
         {
            // Verificar si el cierre fue por stop loss
            if(HistoryDealGetInteger(dealTicket, DEAL_REASON) == DEAL_REASON_SL)
            {
               Print("¡Posición cerrada por Stop Loss! Reiniciando ciclo.");
               CloseAllPositions();
               DeleteAllPendingOrders();
               cycleActive = false;  // Esto activará un nuevo ciclo en la próxima llamada a OnTick()
            }
         }
      }
   }
}