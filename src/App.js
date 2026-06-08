import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// 전달받은 실제 컨트랙트 주소 및 ABI
const CONTRACT_ADDRESS = '0xcc7240d71c588Ba4907a1ad76fe21203fDb18221'
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'autoConfirm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'confirmReceipt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_ipfsHash',
        type: 'string',
      },
    ],
    name: 'createItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'deleteItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'DisputeRaised',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_newIpfsHash',
        type: 'string',
      },
    ],
    name: 'editItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string',
      },
    ],
    name: 'ItemCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
    ],
    name: 'ItemDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newIpfsHash',
        type: 'string',
      },
    ],
    name: 'ItemUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PaymentDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PaymentReleased',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'raiseDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'AUTO_CONFIRM_TIME',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'itemCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'items',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address payable',
        name: 'seller',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'buyer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'lockedTime',
        type: 'uint256',
      },
      {
        internalType: 'enum AdvancedEscrow.State',
        name: 'state',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// 상태(State) 매핑용 배열 (0: Created, 1: Locked, 2: Released, 3: Inactive, 4: Disputed)
const STATUS_LABELS = ['판매중', '예치완료', '거래완료', '삭제됨', '분쟁중']

export default function App() {
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState(null)
  const [products, setProducts] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // 수정 모드 판별용
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageFile: null,
  })

  // 지갑 연결 및 컨트랙트 초기화
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await web3Provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        const escrowContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        )
        setContract(escrowContract)
        fetchItems(escrowContract)
      } else {
        alert('메타마스크를 설치해주세요!')
      }
    }
    init()
  }, [])

  // 블록체인에서 상품 목록 불러오기
  const fetchItems = async (escrowContract) => {
    try {
      const count = await escrowContract.itemCount()
      const fetchedProducts = []
      for (let i = 1; i <= count; i++) {
        const item = await escrowContract.items(i)
        // 삭제된(Inactive) 상품은 화면에서 숨김 처리
        if (Number(item.state) !== 3) {
          fetchedProducts.push({
            id: Number(item.id),
            seller: item.seller,
            buyer: item.buyer,
            price: ethers.formatEther(item.price), // Wei를 ETH로 변환
            ipfsHash: item.ipfsHash,
            state: Number(item.state),
            lockedTime: Number(item.lockedTime),
          })
        }
      }
      setProducts(fetchedProducts.reverse()) // 최신순 정렬
    } catch (err) {
      console.error('데이터 로드 실패:', err)
    }
  }

  // 가상의 IPFS 업로드 함수 (실제 포트폴리오에서는 Pinata API 연동 필요)
  const uploadToIPFS = async (file, name) => {
    console.log('IPFS에 파일 업로드 중...', file)
    // 실제 환경: FormData를 만들어 Pinata API에 전송 후 CID 반환
    return `QmFakeCID_${name}_${new Date().getTime()}` // 더미 CID
  }

  // 1, 2, 8. 상품 등록 및 3. 수정 핸들러 통합
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price)
      return alert('필수 항목을 입력해주세요.')

    try {
      // 8. IPFS 이미지 및 메타데이터 업로드 처리
      const ipfsHash = await uploadToIPFS(formData.imageFile, formData.name)
      const priceInWei = ethers.parseEther(formData.price)

      if (editingId) {
        // 3. 상품 수정 (editItem 호출)
        const tx = await contract.editItem(editingId, priceInWei, ipfsHash)
        await tx.wait()
        alert('상품이 수정되었습니다.')
      } else {
        // 1, 2. 상품 등록 (createItem 호출)
        const tx = await contract.createItem(priceInWei, ipfsHash)
        await tx.wait()
        alert('스마트 컨트랙트에 상품이 등록되었습니다.')
      }

      closeModal()
      fetchItems(contract) // 목록 새로고침
    } catch (err) {
      console.error(err)
      alert('트랜잭션 실패')
    }
  }

  // 4. 상품 삭제 (상태 비활성화)
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      const tx = await contract.deleteItem(id)
      await tx.wait()
      alert('상품이 삭제되었습니다.')
      fetchItems(contract)
    } catch (err) {
      alert('삭제 실패 (판매자만 가능합니다)')
    }
  }

  // 5. 대금 예치 (구매자)
  const handleDeposit = async (id, price) => {
    try {
      const priceInWei = ethers.parseEther(price.toString())
      const tx = await contract.deposit(id, { value: priceInWei })
      await tx.wait()
      alert('대금이 에스크로에 예치되었습니다.')
      fetchItems(contract)
    } catch (err) {
      alert('예치 실패')
    }
  }

  // 구매 확정 (구매자)
  const handleConfirm = async (id) => {
    try {
      const tx = await contract.confirmReceipt(id)
      await tx.wait()
      alert('구매가 확정되었습니다.')
      fetchItems(contract)
    } catch (err) {
      alert('확정 실패')
    }
  }

  // 6. 판매자의 자동 대금 청구 (일정 시간 경과 후)
  const handleAutoConfirm = async (id) => {
    try {
      const tx = await contract.autoConfirm(id)
      await tx.wait()
      alert('자동 확정 처리되어 대금이 입금되었습니다.')
      fetchItems(contract)
    } catch (err) {
      alert(
        '자동 확정 실패: 아직 설정된 시간이 지나지 않았거나 분쟁 상태입니다.',
      )
    }
  }

  // 7. 이의 제기 (구매자)
  const handleDispute = async (id) => {
    if (
      !window.confirm(
        '상품에 문제가 있습니까? 관리자 개입 및 거래가 중단됩니다.',
      )
    )
      return
    try {
      const tx = await contract.raiseDispute(id)
      await tx.wait()
      alert('분쟁 상태로 전환되었습니다.')
      fetchItems(contract)
    } catch (err) {
      alert('이의 제기 실패')
    }
  }

  const openEditModal = (product) => {
    setEditingId(product.id)
    setFormData({
      name: 'IPFS에서 불러온 이름',
      price: product.price,
      imageFile: null,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({ name: '', price: '', imageFile: null })
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>블록체인 안전 마켓</h1>
        <div style={styles.walletInfo}>
          {account
            ? `🟢 ${account.substring(0, 6)}...${account.substring(38)}`
            : '🔴 지갑 미연결'}
        </div>
      </header>

      <main style={styles.mainContent}>
        {products.map((product) => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productImage}>🖼️</div>
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>상품 ID: {product.id}</h3>
              <p style={styles.productPrice}>{product.price} ETH</p>
              <div style={styles.statusBadge(product.state)}>
                {STATUS_LABELS[product.state]}
              </div>
            </div>

            <div style={styles.actionButtons}>
              {/* 내 상품일 때 (판매자 뷰) */}
              {account === product.seller && product.state === 0 && (
                <>
                  <button
                    style={styles.editBtn}
                    onClick={() => openEditModal(product)}
                  >
                    수정
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(product.id)}
                  >
                    삭제
                  </button>
                </>
              )}
              {/* 내 상품인데 예치 중일 때 (자동 확정 버튼 노출) */}
              {account === product.seller && product.state === 1 && (
                <button
                  style={styles.autoBtn}
                  onClick={() => handleAutoConfirm(product.id)}
                >
                  대금 자동 청구
                </button>
              )}

              {/* 남의 상품일 때 (구매자 뷰) */}
              {account !== product.seller && product.state === 0 && (
                <button
                  style={styles.buyBtn}
                  onClick={() => handleDeposit(product.id, product.price)}
                >
                  안전결제 예치
                </button>
              )}
              {/* 내가 구매자이고 예치 완료 상태일 때 */}
              {account === product.buyer && product.state === 1 && (
                <>
                  <button
                    style={styles.confirmBtn}
                    onClick={() => handleConfirm(product.id)}
                  >
                    구매 확정
                  </button>
                  <button
                    style={styles.disputeBtn}
                    onClick={() => handleDispute(product.id)}
                  >
                    이의 제기
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* 등록 플로팅 버튼 */}
      <button style={styles.fab} onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {/* 모달 창 */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editingId ? '상품 수정' : '내 물건 팔기'}</h2>
              <button style={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>이미지 업로드 (IPFS 연동용)</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFile: e.target.files[0] })
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>상품명 (메타데이터용)</label>
                <input
                  style={styles.input}
                  placeholder="상품명"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>가격 설정 (ETH)</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.0001"
                  placeholder="예: 0.05"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                {editingId ? '수정 완료하기' : '스마트 컨트랙트에 등록하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  appContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f5f6f8',
    position: 'relative',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ebebeb',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#ff6f0f',
    fontWeight: 'bold',
  },
  walletInfo: {
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '15px',
  },
  mainContent: { padding: '15px' },
  productCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  productImage: {
    width: '80px',
    height: '80px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    marginRight: '15px',
  },
  productInfo: { flex: 1 },
  productName: { margin: '0 0 5px 0', fontSize: '16px', color: '#333' },
  productPrice: {
    margin: '0 0 8px 0',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#212529',
  },
  statusBadge: (state) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor:
      state === 0
        ? '#e6f3e6'
        : state === 1
          ? '#fff4e6'
          : state === 4
            ? '#ffe3e3'
            : '#f1f3f5',
    color:
      state === 0
        ? '#2b8a3e'
        : state === 1
          ? '#e67700'
          : state === 4
            ? '#e03131'
            : '#868e96',
  }),
  actionButtons: { display: 'flex', flexDirection: 'column', gap: '8px' },
  buyBtn: {
    padding: '8px 12px',
    backgroundColor: '#ff6f0f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  confirmBtn: {
    padding: '8px 12px',
    backgroundColor: '#2b8a3e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  editBtn: {
    padding: '8px 12px',
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '8px 12px',
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  autoBtn: {
    padding: '8px 12px',
    backgroundColor: '#748ffc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  disputeBtn: {
    padding: '8px 12px',
    backgroundColor: '#fa5252',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  fab: {
    position: 'absolute',
    bottom: '30px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#ff6f0f',
    color: 'white',
    fontSize: '35px',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(255, 111, 15, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 30,
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '25px',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#888',
  },
  inputGroup: { marginBottom: '15px' },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#ff6f0f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
}
