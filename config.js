export const AUTHENTICATION = {
    business: "business",
    private: "private"
};

export const ADMIN = {
    business: "business",
    private: "private"
}


export const config = {
    // socket names //
    processOrder : "processOrder",
    updateStoreState: "store.updateStoreState.1",
    orderAction: "store.orderAction.1",
    orderUnprocessing: "order.unprocessing.1",
    confirmRecivedOrder: "store.confirmRecivedOrder.1",
    failedRecivedOrder: 'order.failedRecivedOrder.1',
    newOrderHandler: "user.newOrderHandler.1",
    updateOrderStatus: 'store.updateOrderStatus.1',
    updateFoodData: 'store.updateFoodData.1'
}

export const orderStatusConfig = {
    unprocessing: 'unprocessing',// default
    pending: "pending", // when store recived the order
    procesing: "processing",// when store accept order
    ready: "ready", // when order is ready
    done: "done", // when order is ready
    cancle : "cancle", // when store cancle order
    failed: "failed"
}

export const paymentMethod = {
    visa: "visa",
    credit: "credit",
    mobilePay: "mobilePay"
}

export const discountType = {
    percentage: "percentage"
}

export const storeStatus = {
    customer: 1
}


export default AUTHENTICATION;