const payOrder = function (orderId) {
    tt.showLoading({
      title: '支付发起中', // 内容
    });
    payOrder({
      orderId: orderId,
      userIp: '10.12.218.232',
      deviceId: '882QADU57M5CS'
    }).then(res => {
      tt.hideLoading();
      if(res == void(0)) return;
      if(res.success == true) {
        let params = JSON.parse(res.data)
        let orderInfo = JSON.parse(params['2.0'])
        console.log(this.data.order)
        console.log(orderInfo)
        tt.pay({
          orderInfo,
          service: 1,
          getOrderStatus(res) {
            let { out_order_no } = res;
            return new Promise(function(resolve, reject) {
              // 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
              tt.request({
                url: "<your-backend-url>",
                success(res) {
                  // 商户后端查询的微信支付状态，通知收银台支付结果
                  resolve({ code: 0 });
                },
                fail(err) {
                  reject(err);
                }
              });
            });
          },
          success(res) {
            console.log(res)
            tt.navigateTo({
              url: `/pages/orderDetail/orderDetail?orderNo=${orderId}` // 指定页面的url
            });
          },
          fail(res) {
            console.log(res)
          }
        })
      } else {
        tt.showToast({
          title: '支付失败',
        });
      }
    })
  }