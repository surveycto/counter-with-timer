# Timer with counter (in alpha)

*This plug-in is currently being tested, but has so far worked well.*

![HTML choice lists](extras/preview-images/plain.png)


## Description

Use this plug-in to allow the use of HTML tags with CSS in your choice labels. This pairs well with the [HTML field reference in label](https://github.com/SurveyCTO-field-plug-ins/HTML-field-reference-in-label) plug-in.

## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`|
| Default values | Yes |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | Yes |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `quick` appearance | Yes (`select_one` only) |
| `minimal` appearance | No |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `quickcompact` appearance | No |
| `quickcompact-#` appearance | No |

## How to use

**To use this plug-in as-is**, just download the [htmlchoice.fieldplugin.zip](htmlchoice.fieldplugin.zip) file from this repo, and attach it to your form.

To create your own field plug-in using this as a template, follow these steps:

1. Fork this repo
1. Make changes to the files in the `source` directory.

    * **Note:** be sure to update the `manifest.json` file as well.

1. Zip the updated contents of the `source` directory.
1. Rename the .zip file to *yourpluginname*.fieldplugin.zip (replace *yourpluginname* with the name you want to use for your plug-in).
1. You may then attach your new .fieldplugin.zip file to your form as normal.

## Parameters

This field takes one parameter, the 

## More resources

* **Test form**  
You can find a form definition in this repo here: [extras/test-form](extras/test-form). Be sure to also attach the [htmllabel](https://github.com/SurveyCTO-field-plug-ins/HTML-field-reference-in-label/blob/master/htmllabel.fieldplugin.zip) field plug-in.

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)