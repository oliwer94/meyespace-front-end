"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var OrdinalPipe = (function () {
    function OrdinalPipe() {
    }
    OrdinalPipe.prototype.transform = function (value) {
        var suffix = '';
        var last = value % 10;
        var specialLast = value % 100;
        if (!value || value < 1) {
            return value + "";
        }
        if (last === 1 && specialLast !== 11) {
            suffix = 'st';
        }
        else if (last === 2 && specialLast !== 12) {
            suffix = 'nd';
        }
        else if (last === 3 && specialLast !== 13) {
            suffix = 'rd';
        }
        else {
            suffix = 'th';
        }
        return value + suffix;
    };
    return OrdinalPipe;
}());
OrdinalPipe = __decorate([
    core_1.Pipe({
        name: 'ordinal'
    })
], OrdinalPipe);
exports.OrdinalPipe = OrdinalPipe;
//# sourceMappingURL=ordinal.pipe.js.map