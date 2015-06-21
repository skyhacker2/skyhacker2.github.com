#Cocos2d-x 集成Android蓝牙4.0

1. 复制libPluginBle项目到游戏项目根目录中。
2. 打开AppActivity.java添加如下内容

```
/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.cpp;

import org.cocos2dx.lib.Cocos2dxActivity;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.hunuo.game.plugin.ble.BluetoothActions;
import com.hunuo.game.plugin.ble.BluetoothLeManager;

public class AppActivity extends Cocos2dxActivity {
	
	private static final String TAG = AppActivity.class.getSimpleName();
	
	BluetoothLeManager mManager;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		Log.d(TAG,"onCreate");
		super.onCreate(savedInstanceState);
		mManager = new BluetoothLeManager(this);
		registerReceiver(mGattUpdateReceiver,BluetoothActions.makeGattUpdateIntentFilter());
	}
	
	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		Log.d(TAG, "onResume");
		super.onResume();
        mManager.bindService();
	}
	
	@Override
	protected void onPause() {
		// TODO Auto-generated method stub
		Log.d(TAG, "onPasuse");
		super.onPause();
		mManager.unbindService();
	}


	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		// TODO Auto-generated method stub
		Log.d(TAG, "onActivityResult code: " + requestCode);
		if ((requestCode == BluetoothLeManager.REQUEST_ENABLE_BT || requestCode == BluetoothLeManager.REQUEST_ENABLE_BT_WITH_SERVICE) 
				&& resultCode == Activity.RESULT_CANCELED) {
	        return;
	    }

		if (requestCode == BluetoothLeManager.REQUEST_ENABLE_BT) {
			BluetoothLeManager.startScan();
		}
		if (requestCode == BluetoothLeManager.REQUEST_ENABLE_BT_WITH_SERVICE) {
			BluetoothLeManager.startScan(mManager.getScanningServiceUUIDs());
		}
		
		super.onActivityResult(requestCode, resultCode, data);
		
	}


	// Handles various events fired by the Service.
    // ACTION_GATT_CONNECTED: connected to a GATT server.
    // ACTION_GATT_DISCONNECTED: disconnected from a GATT server.
    // ACTION_GATT_SERVICES_DISCOVERED: discovered GATT services.
    // ACTION_DATA_AVAILABLE: received data from the device.  This can be a result of read
    //                        or notification operations.
    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (BluetoothActions.ACTION_GATT_CONNECTED.equals(action)) {
            	Log.d(TAG, "ACTION_GATT_CONNECTED");
            	final String name = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_NAME);
            	final String address = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_ADDR);
            	AppActivity.this.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						mManager.onConnected(name, address);
					}
				});

            } else if (BluetoothActions.ACTION_GATT_DISCONNECTED.equals(action)) {
            	Log.d(TAG, "ACTION_GATT_DISCONNECTED");
            	final String name = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_NAME);
            	final String address = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_ADDR);
            	AppActivity.this.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						mManager.onDisconnected(name, address);
					}
				});
                
            } else if (BluetoothActions.ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
            	Log.d(TAG, "ACTION_GATT_SERVICES_DISCOVERED");
            	AppActivity.this.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						mManager.onReady();
					}
				});
            } else if (BluetoothActions.ACTION_DATA_READED.equals(action)) {
            	Log.d(TAG, "ACTION_DATA_READED");
            	final String uuid = intent.getStringExtra(BluetoothActions.EXTRA_UUID);
            	final byte[] data = intent.getByteArrayExtra(BluetoothActions.EXTRA_BYTES);
            	AppActivity.this.runOnGLThread(new Runnable() {
					
					@Override
					public void run() {
						mManager.onRead(uuid, data);
						
					}
				});
            } else if (BluetoothActions.ACTION_GATT_SCAN.equals(action)) {
            	Log.d(TAG, "ACTION_GATT_SCAN");
            	final String addr = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_ADDR);
            	final String name = intent.getStringExtra(BluetoothActions.EXTRA_DEVICE_NAME);
            	AppActivity.this.runOnGLThread(new Runnable() {
					
					@Override
					public void run() {
						mManager.onLeScan(addr, name);
					}
				});
            } else if(BluetoothActions.ACTION_DATA_CHANGED.equals(action)) {
            	Log.d(TAG, "ACTION_DATA_CHANGED");
            	final String uuid = intent.getStringExtra(BluetoothActions.EXTRA_UUID);
            	final byte[] data = intent.getByteArrayExtra(BluetoothActions.EXTRA_BYTES);
            	AppActivity.this.runOnGLThread(new Runnable() {
					
					@Override
					public void run() {
						mManager.onCharacteristicChanged(uuid, data);
						
					}
				});
            } else if (BluetoothActions.ACTION_DATA_WRITED.endsWith(action)) {
            	Log.d(TAG, "ACTION_DATA_WRITED");
            	final String uuid = intent.getStringExtra(BluetoothActions.EXTRA_UUID);
            	final int status = intent.getIntExtra(BluetoothActions.EXTRA_STATUS, 0);
            	final byte[] data = intent.getByteArrayExtra(BluetoothActions.EXTRA_BYTES);
            	AppActivity.this.runOnGLThread(new Runnable() {
					
					@Override
					public void run() {
						mManager.onWrite(uuid, data, status);
					}
				});
            }
        }
    };

	
}


```

当程序启动的时候，会启动一个`BluetoothLeService`绑定到`AppActivity`上。

`AppActivity`需要实现一个`BroadcastReceiver`来接收`BluetoothLeService`发出的相关`Action`。

相关Action：

```
ACTION_GATT_CONNECTED 蓝牙已连接
ACTION_GATT_DISCONNECTED 蓝牙断开连接
ACTION_GATT_SERVICES_DISCOVERED 发现完service
ACTION_DATA_READED 读到数据
ACTION_DATA_WRITED 数据已写入
ACTION_GATT_SCAN 搜索蓝牙
ACTION_DATA_CHANGED 数据改变

```

相关数据：

```
EXTRA_DEVICE_NAME 设备名称
EXTRA_DEVICE_ADDR 设备地址
EXTRA_UUID UUID
EXTRA_BYTES 数据

```