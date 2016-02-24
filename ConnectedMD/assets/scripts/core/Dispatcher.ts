module ConnectedMD.Core {

    interface DispatcherPayload {
        module: string,
        action: number,
        data: any
    }

    class AppDispatcher extends Flux.Dispatcher<DispatcherPayload>{
        registerAction(module: string, action: number, callback: (payload: DispatcherPayload) => void):string {
            return super.register(function (payload) {
                if (payload.module !== module || payload.action !== action)
                    return;

                callback(payload);
            });
        }
    }

    export const Dispatcher = new AppDispatcher();
}