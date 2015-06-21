#Android Ble FAQ

##1. Fatal singal 11 error

打开`logcat`，选择`all message`输入`tag:DEBUG`，显示c++的栈调用。

##2. 连接蓝牙后读取数据没有反应

连接蓝牙后要等发现所有services和characteristics后才能readCharacteristics和writeCharacteristics。

##3. jni调用C++方法出现GL_INVALID_OPERATION

在java中直接调用C++方法是在activity的主线程中，但是cocos2d-x的渲染是在另外的线程，所以需要在AppActivity中调用：

```
AppActivity.this.runOnGLThread(new Runnable() {
					
	@Override
	public void run() {
		mManager.onCharacteristicChanged(uuid, data);
						
	}
});

```

##4. setCharacteristicNotification没有反应

调用`mBluetoothGatt.setCharacteristicNotification`后还需要设置Characteristic的Descriptor。

```
BluetoothGattDescriptor descriptor = characteristic.getDescriptor(BluetoothDescriptorUUID.CLIENT_CHARACTERISTIC_CONFIG);

descriptor.setValue(enabled ? BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE : BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);

mBluetoothGatt.writeDescriptor(descriptor);

```

参考[Client Characteristic Configuration](https://developer.bluetooth.org/gatt/descriptors/Pages/DescriptorViewer.aspx?u=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml)

全部Descriptor的描述：[Descriptors](https://developer.bluetooth.org/gatt/descriptors/Pages/DescriptorsHomePage.aspx)

##5. jni内存泄露 local reference table overflow (max=1024)

向jni传送大量数据不及时释放掉就会出现问题。

jstring 转 std::string

```
const char* chars = pEnv->GetStringUTFChars(jstr, NULL);
std::string ret(chars);
pEnv->ReleaseStringUTFChars(jstr, chars);
```

jbyteArray 转 uint8_t*

```
uint8_t *data = (uint8_t*)env->GetByteArrayElements(jdata, 0);
if (data != nullptr) {
	env->ReleaseByteArrayElements(jdata, (jbyte*)data, JNI_ABORT);
}
```

##6. 同时读写丢失请求问题

Android BLE 栈每次只允许读写一个characteristic。

```
gatt.writeCharacteristic(characteristics);
gatt.writeCharacteristic(characteristics);
```

android会忽略掉第二次的请求。

建立一个request队列来解决。
