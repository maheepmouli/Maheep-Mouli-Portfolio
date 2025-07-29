# Supabase Storage Setup Guide

## 🚨 **Storage Bucket Error Fix**

You're getting a "Bucket not found" error because the `portfolio-assets` bucket doesn't exist in your Supabase project.

## ✅ **Quick Fix - Create the Storage Bucket**

### **Step 1: Go to Supabase Dashboard**
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jetefprstmoewdfhhwqq`
3. Go to **Storage** in the left sidebar

### **Step 2: Create the Bucket**
1. Click **"Create a new bucket"**
2. Enter these details:
   - **Name**: `portfolio-assets`
   - **Public bucket**: ✅ **Check this box** (important!)
   - **File size limit**: `50MB` (or your preferred limit)
3. Click **"Create bucket"**

### **Step 3: Set Bucket Permissions**
1. Click on the `portfolio-assets` bucket
2. Go to **Settings** tab
3. Under **Policies**, click **"New Policy"**
4. Choose **"Create a policy from template"**
5. Select **"Allow public access to bucket"**
6. Click **"Review"** and then **"Save policy"**

## 🔧 **Alternative: Update Code to Use Different Bucket**

If you prefer to use a different bucket name, update this file:

**File**: `src/services/imageUploadService.ts`
**Line**: 32
**Change**: `'portfolio-assets'` to your preferred bucket name

## ✅ **Test the Fix**

After creating the bucket:
1. Try uploading an image in your portfolio
2. Check the console for successful upload messages
3. Verify the image appears in your project

## 📊 **Storage Benefits**

With the bucket created:
- ✅ **2GB free storage** for images
- ✅ **Automatic CDN** for fast loading
- ✅ **Public URLs** for easy sharing
- ✅ **No more upload errors**

## 🎯 **Next Steps**

1. **Create the bucket** (5 minutes)
2. **Test image upload** in your portfolio
3. **Enjoy unlimited image storage!**

Your storage will work perfectly after this! 🚀 