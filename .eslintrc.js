module.exports = {
	"globals": {
		"Swal": true,
		"io": true
		
	},
	"env": {
        "browser": true,
        "node": true
    },
	"rules": {
        "no-console": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace|assert)$/]",
                "message": "Unexpected property on console object was called"
            }
        ]
    },
  "extends": "airbnb-base"
};