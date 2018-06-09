define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectPool = /** @class */ (function () {
        function ObjectPool() {
        }
        ObjectPool.get = function (ctor) {
            var typeName = ctor.name;
            if (!ObjectPool.objects[typeName]) {
                ObjectPool.objects[typeName] = [];
            }
            return ObjectPool.objects[typeName].pop() || new ctor();
        };
        ObjectPool.release = function (object) {
            object.reset();
            var typeName = object.constructor.name;
            ObjectPool.objects[typeName].push(object);
        };
        ObjectPool.objects = {};
        return ObjectPool;
    }());
    exports.ObjectPool = ObjectPool;
});
//# sourceMappingURL=ObjectPool.js.map