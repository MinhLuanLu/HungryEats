export const AUTHENTICATION = {
    business: "business",
    private: "private"
}

export const config = {
    // socket names //
    processOrder : "processOrder",
    updateStoreState: "store.updateStoreState.1",
    orderAction: "store.orderAction.1",
    orderPending: "order.pending.1",
    confirmRecivedOrder: "store.confirmRecivedOrder.1"
}

export const orderStatusConfig = {
    unprocessing: 'unprocessing',// default
    pending: "pending", // when store recived the order
    procesing: "processing",// when store recived order
    ready: "ready", // when order is ready
    done: "done", // when order is ready
    cancle : "cancle" // when store cancle order
}



export default AUTHENTICATION;