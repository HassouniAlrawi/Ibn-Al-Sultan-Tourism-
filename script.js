// نظام الإحالة والنقاط
document.addEventListener('DOMContentLoaded', function() {
    // توليد معرف فريد للمستخدم إذا لم يكن موجودًا
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }

    // بيانات المستخدم
    let userData = JSON.parse(localStorage.getItem('userData')) || {
        points: 0,
        referredUsers: []
    };

    // تحديث واجهة المستخدم
    function updateUI() {
        document.getElementById('currentPoints').textContent = userData.points;
        document.getElementById('referredCount').textContent = userData.referredUsers.length;
        
        // تحديث شريط التقدم
        const progressPercentage = (userData.points / 10) * 100;
        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
        
        // إظهار/إخفاء مكافأة الرحلة
        if (userData.points >= 10) {
            document.getElementById('rewardMessage').classList.remove('hidden');
        } else {
            document.getElementById('rewardMessage').classList.add('hidden');
        }
    }

    // توليد رابط الإحالة
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
    document.getElementById('referralLink').value = referralLink;

    // نسخ الرابط
    window.copyReferralLink = function() {
        const linkInput = document.getElementById('referralLink');
        linkInput.select();
        document.execCommand('copy');
        alert('تم نسخ رابط الدعوة بنجاح!');
    }

    // مشاركة على وسائل التواصل
    window.shareOnFacebook = function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        window.open(url, '_blank');
    }

    window.shareOnWhatsApp = function() {
        const url = `https://wa.me/?text=${encodeURIComponent(`انضم إلى رحلة ابن السلطان عبر رابط الدعوة هذا: ${referralLink}`)}`;
        window.open(url, '_blank');
    }

    // زر التواصل (حجز الرحلة)
    window.contactForReward = function() {
        alert('سيتم التواصل معك خلال 24 ساعة لتأكيد رحلتك المجانية!');
    }

    // التحقق من وجود إحالة عند تحميل الصفحة
    function checkReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        
        if (ref && ref !== userId && !userData.referredUsers.includes(ref)) {
            // منع المستخدم من إضافة نقاط لنفسه
            userData.referredUsers.push(ref);
            userData.points += 1;
            localStorage.setItem('userData', JSON.stringify(userData));
            updateUI();
            
            // إزالة معلمة الإحالة من URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // تهيئة الصفحة
    updateUI();
    checkReferral();
});