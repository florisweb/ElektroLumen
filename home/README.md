# Home API

## Data
- Data rows:       [Float/String]
- Device State:    /

### Linked Variables
- 'STATE' + index: Returns the value on that index of the devices state
NI - 'ROWS_GETPROP' + index: Returns an array of all the index-th properties of all the rows
NI - 'ROWS_LATEST': Returns the latest row



## UIDef (UIDefinition)
[
    UIObject
]

### UIObject
{
    type: String (Of UIObjectTypes)
    parameters: [
        String, Int, Float, Array etc,
        Linked variables - see #linked variables
    ]
}

#### UIObjectTypes
- Variable {name, value}






NI: Not Implemented