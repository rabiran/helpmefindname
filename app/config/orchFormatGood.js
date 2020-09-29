module.exports = {
    entry: {
        'xmlns:d': 'http://schemas.microsoft.com/ado/2007/08/dataservices',
        'xmlns:m': 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata',
        xmlns: 'http://www.w3.org/2005/Atom',
        content: {
            type: 'application/xml',
            'm:properties': {
                'd:RunbookId': {
                    type: 'Edm.Guid',
                    $t: '{runBookId}'
                },
                'd:Parameters': {
                    Data: {
                        Parameter: [
                            {
                                ID: 'SamAccountName',
                                Value: '{SamAccountName}' 
                            },
                            {
                                ID: 'DisplayName',
                                Value: '{DisplayName}'
                            },
                            {
                                ID: 'GivenName',
                                Value: '{GivenName}'
                            },
                            {
                                ID: 'SurName',
                                Value: '{SurName}'
                            },
                            {
                                ID: 'Mail',
                                Value: '{Mail}'
                            },
                            {
                                ID: 'ExtensionAttribute1',
                                Value: '{ExtensionAttribute1}'
                            },
                            {
                                ID: 'ExtensionAttribute2',
                                Value: '{ExtensionAttribute2}'
                            },
                            {
                                ID: 'DistinguishedName',
                                Value: '{DistinguishedName}'
                            },
                        ]
                    }
                }
            }
        }
    }
}