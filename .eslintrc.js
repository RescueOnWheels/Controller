module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "multiline-comment-style": ["error", "starred-block"],
        "no-bitwise": "off",
        "no-console": ["error", {
            "allow": ["error", "warn"]
        }],
        "no-mixed-operators": ["error", {
            "groups": [
                ["+", "-", "*", "/", "%", "**"],
                ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                ["&&", "||"],
                ["in", "instanceof"]
            ],
            "allowSamePrecedence": true
        }],
        "no-multiple-empty-lines": ["error", {
            "max": 1,
            "maxBOF": 0,
            "maxEOF": 1
        }],
        "object-property-newline": ["error", {
            "allowAllPropertiesOnSameLine": false
        }],
    }
};